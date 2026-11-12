import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { TripInvitationModel } from './trip-invitation.model';
import { TripInvitationService } from './trip-invitation.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './trip-invitation.component.html',
  styleUrls: ['./trip-invitation.component.scss'],
  standalone: false
})

export class TripInvitationComponent extends BaseListComponent<TripInvitationModel> implements OnInit {
  tripInvitationData!: FormGroup;
  tripInvitations: any;
  allTripInvitations: any;

  constructor(
    public formBuilder: FormBuilder,
    public tripInvitationService: TripInvitationService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Invitations', active: true }];

    this.filterForm = this.createTripInvitationFilterForm();

    this.displayedColumns = ['TripName', 'EmailId', 'TripRole', 'TokenHash', 'ExpiredDate', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial tripInvitations data
    this.paginationService.PageIndex = 0;
    this.onLoadTripInvitationsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadTripInvitationsByCriteria();
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

      this.onLoadTripInvitationsByCriteria();
    });
  }

  onLoadTripInvitationsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTripInvitationParams();

    this.tripInvitationService.GetAllByCriteria(params).subscribe(response => {
      this.tripInvitations = response.Results;
      this.allTripInvitations = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTripInvitationsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTripInvitationsByCriteria();
  }

  onLoadTripInvitationsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadTripInvitationsByCriteria();
  }

  resetTripInvitationsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadTripInvitationsByCriteria();
  }

  onDeleteTripInvitation(tripInvitationIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'TripInvitation')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.tripInvitationService.deleteTripInvitationById(tripInvitationIds)
            .subscribe((tripInvitationResp: any) => {

              if (tripInvitationResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('TripInvitation deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTripInvitations(): void {
    this.onDeleteTripInvitation(this.CheckedDeletedIds);
  }

  exportTripInvitationsData(): void {
    this.showHideLoading(true);

    let params = this.getTripInvitationParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.tripInvitationService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.InvitationId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "TripInvitations");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create TripInvitation Filters form and returns {FormGroup}
  createTripInvitationFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get TripInvitation Params
  getTripInvitationParams(): any {
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

  // TripInvitations Pagination
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

    this.onLoadTripInvitationsByCriteria();
  }

  // Search Data in TripInvitations
  performSearchInTripInvitations(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allTripInvitations.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.tripInvitations = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all tripInvitation items
  checkUncheckAllTripInvitations(evt: any) {
    this.tripInvitations.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTripInvitation(evt);
  }

  // Check/uncheck selected tripInvitation
  onSelectedTripInvitation(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.tripInvitations.length; i++) {
      if (this.tripInvitations[i].state == true) {
        this.CheckedDeletedIds.push(this.tripInvitations[i].InvitationId);
      }
    }
  }

  // Sort TripInvitations Data
  onSortTripInvitations(column: any) {
    this.tripInvitations = this.paginationService.onSort(column, this.allTripInvitations)
  }
}
