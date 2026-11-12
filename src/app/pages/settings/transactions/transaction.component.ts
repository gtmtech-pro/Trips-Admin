import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { TransactionModel } from './transaction.model';
import { TransactionService } from './transaction.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  standalone: false
})

export class TransactionComponent extends BaseListComponent<TransactionModel> implements OnInit {
  transactionData!: FormGroup;
  transactions: any;
  allTransactions: any;

  constructor(
    public formBuilder: FormBuilder,
    public transactionService: TransactionService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Transactions', active: true }];

    this.filterForm = this.createTransactionFilterForm();
    this.displayedColumns = ['Code', 'Name', 'PageTitle', 'RouteUrl', 'DisplayOrder', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial transactions data
    this.paginationService.PageIndex = 0;
    this.onLoadTransactionsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadTransactionsByCriteria();
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

      this.onLoadTransactionsByCriteria();
    });
  }

  onLoadTransactionsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTransactionParams();

    this.transactionService.GetAllByCriteria(params).subscribe(response => {
      this.transactions = response.Results;
      this.allTransactions = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTransactionsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTransactionsByCriteria();
  }

  onLoadTransactionsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadTransactionsByCriteria();
  }

  resetTransactionsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadTransactionsByCriteria();
  }

  onDeleteTransaction(transactionIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Transaction')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.transactionService.deleteTransactionById(transactionIds)
            .subscribe((transactionResp: any) => {

              if (transactionResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Transaction deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTransactions(): void {
    this.onDeleteTransaction(this.CheckedDeletedIds);
  }

  exportTransactionsData(): void {
    this.showHideLoading(true);

    let params = this.getTransactionParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.transactionService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.TransactionId;
          delete results.UrlPara;
          delete results.IconUrl;
          delete results.Remarks;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Transactions");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Transaction Filters form and returns {FormGroup}
  createTransactionFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Transaction Params
  getTransactionParams(): any {
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

  // Transactions Pagination
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

    this.onLoadTransactionsByCriteria();
  }

  // Search Data in Transactions
  performSearchInTransactions(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allTransactions.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.transactions = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all transaction items
  checkUncheckAllTransactions(evt: any) {
    this.transactions.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTransaction(evt);
  }

  // Check/uncheck selected transaction
  onSelectedTransaction(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].state == true) {
        this.CheckedDeletedIds.push(this.transactions[i].TransactionId);
      }
    }
  }

  // Sort Transactions Data
  onSortTransactions(column: any) {
    this.transactions = this.paginationService.onSort(column, this.allTransactions)
  }
}
