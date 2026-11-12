import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { TripPlaceModel } from './trip-place.model';
import { TripPlaceService } from './trip-place.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './trip-place.component.html',
  styleUrls: ['./trip-place.component.scss'],
  standalone: false
})

export class TripPlaceComponent extends BaseListComponent<TripPlaceModel> implements OnInit {
  tripPlaceData!: FormGroup;
  tripPlaces: any;
  allTripPlaces: any;

  constructor(
    public formBuilder: FormBuilder,
    public tripPlaceService: TripPlaceService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Places', active: true }];

    this.filterForm = this.createTripPlaceFilterForm();

    this.displayedColumns = ['TripDayName', 'PlaceName', 'LocationName', 'TripAddress', 'Description', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial tripPlaces data
    this.paginationService.PageIndex = 0;
    this.onLoadTripPlacesByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadTripPlacesByCriteria();
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

      this.onLoadTripPlacesByCriteria();
    });
  }

  onLoadTripPlacesByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTripPlaceParams();

    this.tripPlaceService.GetAllByCriteria(params).subscribe(response => {
      this.tripPlaces = response.Results;
      this.allTripPlaces = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTripPlacesByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTripPlacesByCriteria();
  }

  onLoadTripPlacesByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadTripPlacesByCriteria();
  }

  resetTripPlacesFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadTripPlacesByCriteria();
  }

  onDeleteTripPlace(tripPlaceIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'TripPlace')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.tripPlaceService.deleteTripPlaceById(tripPlaceIds)
            .subscribe((tripPlaceResp: any) => {

              if (tripPlaceResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('TripPlace deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTripPlaces(): void {
    this.onDeleteTripPlace(this.CheckedDeletedIds);
  }

  exportTripPlacesData(): void {
    this.showHideLoading(true);

    let params = this.getTripPlaceParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.tripPlaceService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.PlaceId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "TripPlaces");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create TripPlace Filters form and returns {FormGroup}
  createTripPlaceFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get TripPlace Params
  getTripPlaceParams(): any {
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

  // TripPlaces Pagination
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

    this.onLoadTripPlacesByCriteria();
  }

  // Search Data in TripPlaces
  performSearchInTripPlaces(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allTripPlaces.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.tripPlaces = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all tripPlace items
  checkUncheckAllTripPlaces(evt: any) {
    this.tripPlaces.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTripPlace(evt);
  }

  // Check/uncheck selected tripPlace
  onSelectedTripPlace(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.tripPlaces.length; i++) {
      if (this.tripPlaces[i].state == true) {
        this.CheckedDeletedIds.push(this.tripPlaces[i].PlaceId);
      }
    }
  }

  // Sort TripPlaces Data
  onSortTripPlaces(column: any) {
    this.tripPlaces = this.paginationService.onSort(column, this.allTripPlaces)
  }
}
