import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { TripDayModel } from './trip-day.model';
import { TripDayService } from './trip-day.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './trip-day.component.html',
  styleUrls: ['./trip-day.component.scss'],
  standalone: false
})

export class TripDayComponent extends BaseListComponent<TripDayModel> implements OnInit {
  tripDayData!: FormGroup;
  tripDays: any;
  allTripDays: any;

  constructor(
    public formBuilder: FormBuilder,
    public tripDayService: TripDayService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Days', active: true }];

    this.filterForm = this.createTripDayFilterForm();

    this.displayedColumns = ['TripName', 'DayNumber', 'TripDate', 'Title', 'Notes', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial tripDays data
    this.paginationService.PageIndex = 0;
    this.onLoadTripDaysByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadTripDaysByCriteria();
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

      this.onLoadTripDaysByCriteria();
    });
  }

  onLoadTripDaysByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTripDayParams();

    this.tripDayService.GetAllByCriteria(params).subscribe(response => {
      this.tripDays = response.Results;
      this.allTripDays = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTripDaysByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTripDaysByCriteria();
  }

  onLoadTripDaysByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadTripDaysByCriteria();
  }

  resetTripDaysFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadTripDaysByCriteria();
  }

  onDeleteTripDay(tripDayIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'TripDay')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.tripDayService.deleteTripDayById(tripDayIds)
            .subscribe((tripDayResp: any) => {

              if (tripDayResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('TripDay deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTripDays(): void {
    this.onDeleteTripDay(this.CheckedDeletedIds);
  }

  exportTripDaysData(): void {
    this.showHideLoading(true);

    let params = this.getTripDayParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.tripDayService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.TripDayId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "TripDays");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create TripDay Filters form and returns {FormGroup}
  createTripDayFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get TripDay Params
  getTripDayParams(): any {
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

  // TripDays Pagination
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

    this.onLoadTripDaysByCriteria();
  }

  // Search Data in TripDays
  performSearchInTripDays(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allTripDays.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.tripDays = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all tripDay items
  checkUncheckAllTripDays(evt: any) {
    this.tripDays.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTripDay(evt);
  }

  // Check/uncheck selected tripDay
  onSelectedTripDay(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.tripDays.length; i++) {
      if (this.tripDays[i].state == true) {
        this.CheckedDeletedIds.push(this.tripDays[i].TripDayId);
      }
    }
  }

  // Sort TripDays Data
  onSortTripDays(column: any) {
    this.tripDays = this.paginationService.onSort(column, this.allTripDays)
  }
}
