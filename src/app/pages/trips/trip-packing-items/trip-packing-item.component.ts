import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { TripPackingItemModel } from './trip-packing-item.model';
import { TripPackingItemService } from './trip-packing-item.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './trip-packing-item.component.html',
  styleUrls: ['./trip-packing-item.component.scss'],
  standalone: false
})

export class TripPackingItemComponent extends BaseListComponent<TripPackingItemModel> implements OnInit {
  tripPackingItemData!: FormGroup;
  tripPackingItems: any;
  allTripPackingItems: any;

  constructor(
    public formBuilder: FormBuilder,
    public tripPackingItemService: TripPackingItemService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Packing Items', active: true }];

    this.filterForm = this.createTripPackingItemFilterForm();

    this.displayedColumns = ['TripName', 'CategoryName', 'ItemName', 'Quantity', 'IsPacked', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial tripPackingItems data
    this.paginationService.PageIndex = 0;
    this.onLoadTripPackingItemsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadTripPackingItemsByCriteria();
          return false;
        }

        return res.length > 2
      }),

      // Time in milliseconds between key events
      debounceTime(650),

      // If previous query is diffent from current
      distinctUntilChanged()

      // subscription for response
    ).subscribe((searchText: string) => {
      this.paginationService.PageIndex = 0;
      this.filterForm.controls["SearchText"].setValue(searchText);

      this.onLoadTripPackingItemsByCriteria();
    });
  }

  onLoadTripPackingItemsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTripPackingItemParams();

    this.tripPackingItemService.GetAllByCriteria(params).subscribe(response => {
      this.tripPackingItems = response.Results;
      this.allTripPackingItems = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTripPackingItemsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTripPackingItemsByCriteria();
  }

  onLoadTripPackingItemsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadTripPackingItemsByCriteria();
  }

  resetTripPackingItemsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadTripPackingItemsByCriteria();
  }

  onDeleteTripPackingItem(tripPackingItemIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'TripPackingItem')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.tripPackingItemService.deleteTripPackingItemById(tripPackingItemIds)
            .subscribe((tripPackingItemResp: any) => {

              if (tripPackingItemResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('TripPackingItem deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTripPackingItems(): void {
    this.onDeleteTripPackingItem(this.CheckedDeletedIds);
  }

  exportTripPackingItemsData(): void {
    this.showHideLoading(true);

    let params = this.getTripPackingItemParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.tripPackingItemService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.PackingItemId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "TripPackingItems");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create TripPackingItem Filters form and returns {FormGroup}
  createTripPackingItemFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get TripPackingItem Params
  getTripPackingItemParams(): any {
    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["SearchText"]?.value,
      Status: JSON.parse(this.filterForm.controls["Status"]?.value),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // TripPackingItems Pagination
  onPageIndexChanged(evt: any) {
    if (evt.target.text == undefined) return;

    if (evt.target.text == 'Next')
      this.paginationService.PageIndex = this.paginationService.PageIndex + 1;
    else if (evt.target.text == 'Last')
      this.paginationService.PageIndex = Math.ceil(this.paginationService.TotalRows / this.paginationService.PageSize) - 1;
    else if (evt.target.text == 'Prev')
      this.paginationService.PageIndex = this.paginationService.PageIndex - 1;
    else if (evt.target.text == 'First')
      this.paginationService.PageIndex = 0;
    else
      this.paginationService.PageIndex = parseInt(evt.target.text) - 1;

    this.onLoadTripPackingItemsByCriteria();
  }

  // Search Data in TripPackingItems
  performSearchInTripPackingItems(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allTripPackingItems.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.tripPackingItems = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all tripPackingItem items
  checkUncheckAllTripPackingItems(evt: any) {
    this.tripPackingItems.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTripPackingItem(evt);
  }

  // Check/uncheck selected tripPackingItem
  onSelectedTripPackingItem(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.tripPackingItems.length; i++) {
      if (this.tripPackingItems[i].state == true) {
        this.CheckedDeletedIds.push(this.tripPackingItems[i].PackingItemId);
      }
    }
  }

  // Sort TripPackingItems Data
  onSortTripPackingItems(column: any) {
    this.tripPackingItems = this.paginationService.onSort(column, this.allTripPackingItems)
  }
}
