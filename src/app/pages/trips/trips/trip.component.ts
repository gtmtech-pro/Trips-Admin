import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { RootReducerState } from '../../../store';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { TripModel } from './trip.model';
import { TripService } from './trip.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { PaginationService } from '../../../core/services/pagination.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
  standalone: false
})

export class TripComponent extends BaseListComponent<TripModel> implements OnInit {
  tripData!: FormGroup;
  trips: any;
  allTrips: any;

  constructor(
    public formBuilder: FormBuilder,
    public tripService: TripService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public store: Store<{ data: RootReducerState }>,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Trips', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createTripFilterForm();

    this.displayedColumns = ['AccountName', 'TripName', 'Destination', 'StartDate', 'EndDate', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial trips data
    this.paginationService.PageIndex = 0;
    this.onLoadTripsByCriteria();
  }

  onLoadTripsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTripParams();

    this.tripService.GetAllByCriteria(params).subscribe(response => {
      this.trips = response.Results;
      this.allTrips = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTripsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTripsByCriteria();
  }

  onLoadTripsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["TripStatus"].setValue(transStatus);

    this.onLoadTripsByCriteria();
  }

  resetTripsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadTripsByCriteria();
  }

  onDeleteTrip(tripIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, this.Constants.Messages.DeleteConfirmationTitle)
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.tripService.deleteTripById(tripIds)
            .subscribe((tripResp: any) => {

              if (tripResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Trip deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTrips(): void {
    this.onDeleteTrip(this.CheckedDeletedIds);
  }

  exportTripsData(): void {
    this.showHideLoading(true);

    let params = this.getTripParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.tripService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.TripId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Trips");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Trip Filters form and returns {FormGroup}
  createTripFilterForm(): FormGroup {
    return this.formBuilder.group({
      TripName: new FormControl({ value: null, disabled: false }),
      TripStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Trip Params
  getTripParams(): any {
    let transStatus = this.filterForm.controls["TripStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["TripName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // Trips Pagination
  onPageIndexChanged(evt: any) {
    if (evt.target.text == undefined) return;

    this.searchForm.controls['SearchText'].setValue('');

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

    this.onLoadTripsByCriteria();
  }

  // Search Data in Trips
  performSearchInTrips(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allTrips.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.trips = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all trip items
  checkUncheckAllTrips(evt: any) {
    this.trips.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTrip(evt);
  }

  // Check/uncheck selected trip
  onSelectedTrip(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.trips.length; i++) {
      if (this.trips[i].state == true) {
        this.CheckedDeletedIds.push(this.trips[i].TripId);
      }
    }
  }

  // Sort Trips Data
  onSortTrips(column: any) {
    this.trips = this.paginationService.onSort(column, this.allTrips)
  }
}
