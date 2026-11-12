import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { DropdownModel } from '../../../models/dropdown.model';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { RoleTransactionModel } from './role-transaction.model';
import { RoleTransactionService } from './role-transaction.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './role-transaction.component.html',
  styleUrls: ['./role-transaction.component.scss'],
  standalone: false
})

export class RoleTransactionComponent extends BaseListComponent<RoleTransactionModel> implements OnInit {
  roleTransactionData!: FormGroup;
  roleTransactions: any;
  allRoleTransactions: any;
  roleList!: DropdownModel[]; departmentList!: DropdownModel[];
  designationList!: DropdownModel[]; filteredDesignationItems!: DropdownModel[];

  constructor(
    public formBuilder: FormBuilder,
    public roleTransactionService: RoleTransactionService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Role Transactions', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createRoleTransactionFilterForm();

    this.displayedColumns = ['RoleName', 'Rights', 'CanAdd', 'CanEdit', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.roleTransactionService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.roleList = results[0].Results;
      }
      if (results[1].Success) {
        this.departmentList = results[1].Results;
      }
      if (results[2].Success) {
        this.designationList = results[2].Results;
        this.filteredDesignationItems = this.designationList.slice();
      }

      //Load initial roleTransactions data
      this.paginationService.PageIndex = 0;
      this.onLoadRoleTransactionsByCriteria();
    });

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadRoleTransactionsByCriteria();
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

      this.onLoadRoleTransactionsByCriteria();
    });
  }

  onLoadRoleTransactionsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getRoleTransactionParams();

    this.roleTransactionService.GetAllByCriteria(params).subscribe(response => {
      this.roleTransactions = response.Results;
      this.allRoleTransactions = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadRoleTransactionsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadRoleTransactionsByCriteria();
  }

  onLoadRoleTransactionsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["RoleTransactionStatus"].setValue(transStatus);

    this.onLoadRoleTransactionsByCriteria();
  }

  resetRoleTransactionsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadRoleTransactionsByCriteria();
  }

  onDeleteRoleTransaction(roleTransactionIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, "Role Transaction")
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.roleTransactionService.deleteRoleTransactionById(roleTransactionIds)
            .subscribe((roleTransactionResp: any) => {

              if (roleTransactionResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('RoleTransaction deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleRoleTransactions(): void {
    this.onDeleteRoleTransaction(this.CheckedDeletedIds);
  }

  exportRoleTransactionsData(): void {
    this.showHideLoading(true);

    let params = this.getRoleTransactionParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.roleTransactionService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.RoleTransactionId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "RoleTransactions");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create RoleTransaction Filters form and returns {FormGroup}
  createRoleTransactionFilterForm(): FormGroup {
    return this.formBuilder.group({
      RoleId: new FormControl({ value: null, disabled: false }),
      DepartmentId: new FormControl({ value: null, disabled: false }),
      DesignationId: new FormControl({ value: null, disabled: false }),
      TransactionName: new FormControl({ value: null, disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get RoleTransaction Params
  getRoleTransactionParams(): any {
    let transStatus = this.filterForm.controls["Status"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId1: this.filterForm.controls["RoleId"].value,
      DepartmentId: this.filterForm.controls["DepartmentId"].value,
      DesignationId: this.filterForm.controls["DesignationId"].value,
      Name: this.filterForm.controls["TransactionName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // RoleTransactions Pagination
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

    this.onLoadRoleTransactionsByCriteria();
  }

  // Search Data in RoleTransactions
  performSearchInRoleTransactions(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allRoleTransactions.filter((item: any) => {
      return (
        item.RoleName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.TransactionName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.DepartmentName.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.roleTransactions = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all roleTransaction items
  checkUncheckAllRoleTransactions(evt: any) {
    this.roleTransactions.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedRoleTransaction(evt);
  }

  // Check/uncheck selected roleTransaction
  onSelectedRoleTransaction(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.roleTransactions.length; i++) {
      if (this.roleTransactions[i].state == true) {
        this.CheckedDeletedIds.push(this.roleTransactions[i].RoleTransactionId);
      }
    }
  }

  // Sort RoleTransactions Data
  onSortRoleTransactions(column: any) {
    this.roleTransactions = this.paginationService.onSort(column, this.allRoleTransactions)
  }

  onChangeDepartment(event: any) {
    if (event != undefined) {
      let departmentId = this.filterForm.controls["DepartmentId"].value;
      this.filteredDesignationItems = this.designationList.filter(x => x.Description == departmentId);
    }
    else {
      this.filteredDesignationItems = [];
      this.filterForm.controls['DesignationId'].setValue(null);
    }

    this.filteredDesignationItems.unshift({ Id: null, Name: "Select Designation", Description: 'Designation', SequenceNo: 1, IsDisabled: false, IsSelected: true });
  }
}
