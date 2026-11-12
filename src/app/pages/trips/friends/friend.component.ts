import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { FriendModel } from './friend.model';
import { FriendService } from './friend.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
  standalone: false
})

export class FriendComponent extends BaseListComponent<FriendModel> implements OnInit {
  friendData!: FormGroup;
  friends: any;
  allFriends: any;

  constructor(
    public formBuilder: FormBuilder,
    public friendService: FriendService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Friends', active: true }];

    this.filterForm = this.createFriendFilterForm();

    this.displayedColumns = ['EmployeeCode', 'FirstName', 'MiddleName', 'LastName', 'EmployeeName', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial friends data
    this.paginationService.PageIndex = 0;
    this.onLoadFriendsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadFriendsByCriteria();
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

      this.onLoadFriendsByCriteria();
    });
  }

  onLoadFriendsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getFriendParams();

    this.friendService.GetAllByCriteria(params).subscribe(response => {
      this.friends = response.Results;
      this.allFriends = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadFriendsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadFriendsByCriteria();
  }

  onLoadFriendsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadFriendsByCriteria();
  }

  resetFriendsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadFriendsByCriteria();
  }

  onDeleteFriend(friendIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Friend')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.friendService.deleteFriendById(friendIds)
            .subscribe((friendResp: any) => {

              if (friendResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Friend deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleFriends(): void {
    this.onDeleteFriend(this.CheckedDeletedIds);
  }

  exportFriendsData(): void {
    this.showHideLoading(true);

    let params = this.getFriendParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.friendService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.EmployeeId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Friends");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Friend Filters form and returns {FormGroup}
  createFriendFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Friend Params
  getFriendParams(): any {
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

  // Friends Pagination
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

    this.onLoadFriendsByCriteria();
  }

  // Search Data in Friends
  performSearchInFriends(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allFriends.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.friends = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all friend items
  checkUncheckAllFriends(evt: any) {
    this.friends.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedFriend(evt);
  }

  // Check/uncheck selected friend
  onSelectedFriend(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.friends.length; i++) {
      if (this.friends[i].state == true) {
        this.CheckedDeletedIds.push(this.friends[i].EmployeeId);
      }
    }
  }

  // Sort Friends Data
  onSortFriends(column: any) {
    this.friends = this.paginationService.onSort(column, this.allFriends)
  }
}
