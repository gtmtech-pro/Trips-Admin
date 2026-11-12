import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { AccountTransactionModel } from './account-transaction.model';
import { AccountTransactionService } from './account-transaction.service';
import { ShowDialogService } from '../../../shared/show-dialog.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './account-transaction.component.html',
  styleUrls: ['./account-transaction.component.scss'],
  standalone: false
})

export class AccountTransactionComponent extends BaseListComponent<AccountTransactionModel> implements OnInit {
  accountTransactionData!: FormGroup;
  accountTransactions: any;
  allAccountTransactions: any;

  constructor(
    public formBuilder: FormBuilder,
    public accountTransactionService: AccountTransactionService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Account Transactions', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createAccountTransactionFilterForm();

    this.displayedColumns = ['AccountName', 'Rights', 'CanAdd', 'CanEdit', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial accountTransactions data
    this.paginationService.PageIndex = 0;
    this.onLoadAccountTransactionsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadAccountTransactionsByCriteria();
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

      this.onLoadAccountTransactionsByCriteria();
    });
  }

  onLoadAccountTransactionsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getAccountTransactionParams();

    this.accountTransactionService.GetAllByCriteria(params).subscribe(response => {
      this.accountTransactions = response.Results;
      this.allAccountTransactions = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadAccountTransactionsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadAccountTransactionsByCriteria();
  }

  onLoadAccountTransactionsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["AccountTransactionStatus"].setValue(transStatus);

    this.onLoadAccountTransactionsByCriteria();
  }

  resetAccountTransactionsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadAccountTransactionsByCriteria();
  }

  onDeleteAccountTransaction(accountTransactionIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Account Transaction')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.accountTransactionService.deleteAccountTransactionById(accountTransactionIds)
            .subscribe((accountTransactionResp: any) => {

              if (accountTransactionResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('AccountTransaction deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleAccountTransactions(): void {
    this.onDeleteAccountTransaction(this.CheckedDeletedIds);
  }

  exportAccountTransactionsData(): void {
    this.showHideLoading(true);

    let params = this.getAccountTransactionParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.accountTransactionService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.AccountTransactionId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "AccountTransactions");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create AccountTransaction Filters form and returns {FormGroup}
  createAccountTransactionFilterForm(): FormGroup {
    return this.formBuilder.group({
      AccountTransactionName: new FormControl({ value: null, disabled: false }),
      AccountTransactionStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get AccountTransaction Params
  getAccountTransactionParams(): any {
    let transStatus = this.filterForm.controls["AccountTransactionStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["AccountTransactionName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // AccountTransactions Pagination
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

    this.onLoadAccountTransactionsByCriteria();
  }

  // Search Data in AccountTransactions
  performSearchInAccountTransactions(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allAccountTransactions.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.accountTransactions = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all accountTransaction items
  checkUncheckAllAccountTransactions(evt: any) {
    this.accountTransactions.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedAccountTransaction(evt);
  }

  // Check/uncheck selected accountTransaction
  onSelectedAccountTransaction(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.accountTransactions.length; i++) {
      if (this.accountTransactions[i].state == true) {
        this.CheckedDeletedIds.push(this.accountTransactions[i].AccountTransactionId);
      }
    }
  }

  // Sort AccountTransactions Data
  onSortAccountTransactions(column: any) {
    this.accountTransactions = this.paginationService.onSort(column, this.allAccountTransactions)
  }
}
