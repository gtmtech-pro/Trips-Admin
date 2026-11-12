import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { AccountModel } from './account.model';
import { AccountService } from './account.service';
import { ShowDialogService } from '../../../shared/show-dialog.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: false
})

export class AccountComponent extends BaseListComponent<AccountModel> implements OnInit {
  accountData!: FormGroup;
  accounts: any;
  allAccounts: any;

  constructor(
    public formBuilder: FormBuilder,
    public accountService: AccountService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Admins' }, { label: 'Accounts', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createAccountFilterForm();

    this.displayedColumns = ['LoginId', 'UserId', 'UserName', 'EmailId', 'Mobile', 'Designation', 'IsApproved', 'IsLocked', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial accounts data
    this.paginationService.PageIndex = 0;
    this.onLoadAccountsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadAccountsByCriteria();
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

      this.onLoadAccountsByCriteria();
    });
  }

  onLoadAccountsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getAccountParams();

    this.accountService.GetAllByCriteria(params).subscribe(response => {
      this.accounts = response.Results;
      this.allAccounts = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadAccountsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadAccountsByCriteria();
  }

  onLoadAccountsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["AccountStatus"].setValue(transStatus);

    this.onLoadAccountsByCriteria();
  }

  resetAccountsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadAccountsByCriteria();
  }

  onDeleteAccount(accountIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Account')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.accountService.deleteAccountById(accountIds)
            .subscribe((accountResp: any) => {

              if (accountResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Account deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleAccounts(): void {
    this.onDeleteAccount(this.CheckedDeletedIds);
  }

  exportAccountsData(): void {
    this.showHideLoading(true);

    let params = this.getAccountParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.accountService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.AccountId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Accounts");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Account Filters form and returns {FormGroup}
  createAccountFilterForm(): FormGroup {
    return this.formBuilder.group({
      AccountName: new FormControl({ value: null, disabled: false }),
      AccountStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Account Params
  getAccountParams(): any {
    let transStatus = this.filterForm.controls["AccountStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["AccountName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // Accounts Pagination
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

    this.onLoadAccountsByCriteria();
  }

  // Search Data in Accounts
  performSearchInAccounts(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allAccounts.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.accounts = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all account items
  checkUncheckAllAccounts(evt: any) {
    this.accounts.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedAccount(evt);
  }

  // Check/uncheck selected account
  onSelectedAccount(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].state == true) {
        this.CheckedDeletedIds.push(this.accounts[i].AccountId);
      }
    }
  }

  // Sort Accounts Data
  onSortAccounts(column: any) {
    this.accounts = this.paginationService.onSort(column, this.allAccounts)
  }
}
