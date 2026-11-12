import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { TripMemberModel } from './trip-member.model';
import { TripMemberService } from './trip-member.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './trip-member.component.html',
  styleUrls: ['./trip-member.component.scss'],
  standalone: false
})

export class TripMemberComponent extends BaseListComponent<TripMemberModel> implements OnInit {
  tripMemberData!: FormGroup;
  tripMembers: any;
  allTripMembers: any;

  constructor(
    public formBuilder: FormBuilder,
    public tripMemberService: TripMemberService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Members', active: true }];

    this.filterForm = this.createTripMemberFilterForm();

    this.displayedColumns = ['TripId', 'UserId', 'MemberName', 'EmailId', 'MobileNo', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial tripMembers data
    this.paginationService.PageIndex = 0;
    this.onLoadTripMembersByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadTripMembersByCriteria();
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

      this.onLoadTripMembersByCriteria();
    });
  }

  onLoadTripMembersByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTripMemberParams();

    this.tripMemberService.GetAllByCriteria(params).subscribe(response => {
      this.tripMembers = response.Results;
      this.allTripMembers = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTripMembersByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTripMembersByCriteria();
  }

  onLoadTripMembersByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadTripMembersByCriteria();
  }

  resetTripMembersFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadTripMembersByCriteria();
  }

  onDeleteTripMember(tripMemberIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'TripMember')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.tripMemberService.deleteTripMemberById(tripMemberIds)
            .subscribe((tripMemberResp: any) => {

              if (tripMemberResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('TripMember deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTripMembers(): void {
    this.onDeleteTripMember(this.CheckedDeletedIds);
  }

  exportTripMembersData(): void {
    this.showHideLoading(true);

    let params = this.getTripMemberParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.tripMemberService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.TripMemberId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "TripMembers");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create TripMember Filters form and returns {FormGroup}
  createTripMemberFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get TripMember Params
  getTripMemberParams(): any {
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

  // TripMembers Pagination
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

    this.onLoadTripMembersByCriteria();
  }

  // Search Data in TripMembers
  performSearchInTripMembers(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allTripMembers.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.tripMembers = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all tripMember items
  checkUncheckAllTripMembers(evt: any) {
    this.tripMembers.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTripMember(evt);
  }

  // Check/uncheck selected tripMember
  onSelectedTripMember(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.tripMembers.length; i++) {
      if (this.tripMembers[i].state == true) {
        this.CheckedDeletedIds.push(this.tripMembers[i].TripMemberId);
      }
    }
  }

  // Sort TripMembers Data
  onSortTripMembers(column: any) {
    this.tripMembers = this.paginationService.onSort(column, this.allTripMembers)
  }
}
