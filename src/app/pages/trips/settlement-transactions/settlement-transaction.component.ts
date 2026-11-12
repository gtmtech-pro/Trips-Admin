import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { SettlementTransactionModel } from './settlement-transaction.model';
import { SettlementTransactionService } from './settlement-transaction.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './settlement-transaction.component.html',
  styleUrls: ['./settlement-transaction.component.scss'],
  standalone: false
})

export class SettlementTransactionComponent extends BaseListComponent<SettlementTransactionModel> implements OnInit {
  settlementTransactionData!: FormGroup;
  settlementTransactions: any;
  allSettlementTransactions: any;

  constructor(
    public formBuilder: FormBuilder,
    public settlementTransactionService: SettlementTransactionService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Settlement Transactions', active: true }];

    this.filterForm = this.createSettlementTransactionFilterForm();

    this.displayedColumns = ['SettlementName', 'TripMemberName', 'TripMemberName', 'Amount', 'TransactionStatus', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial settlementTransactions data
    this.paginationService.PageIndex = 0;
    this.onLoadSettlementTransactionsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadSettlementTransactionsByCriteria();
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

      this.onLoadSettlementTransactionsByCriteria();
    });
  }

  onLoadSettlementTransactionsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getSettlementTransactionParams();

    this.settlementTransactionService.GetAllByCriteria(params).subscribe(response => {
      this.settlementTransactions = response.Results;
      this.allSettlementTransactions = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadSettlementTransactionsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadSettlementTransactionsByCriteria();
  }

  onLoadSettlementTransactionsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadSettlementTransactionsByCriteria();
  }

  resetSettlementTransactionsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadSettlementTransactionsByCriteria();
  }

  onDeleteSettlementTransaction(settlementTransactionIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'SettlementTransaction')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.settlementTransactionService.deleteSettlementTransactionById(settlementTransactionIds)
            .subscribe((settlementTransactionResp: any) => {

              if (settlementTransactionResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('SettlementTransaction deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleSettlementTransactions(): void {
    this.onDeleteSettlementTransaction(this.CheckedDeletedIds);
  }

  exportSettlementTransactionsData(): void {
    this.showHideLoading(true);

    let params = this.getSettlementTransactionParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.settlementTransactionService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.SettlementTransactionId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "SettlementTransactions");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create SettlementTransaction Filters form and returns {FormGroup}
  createSettlementTransactionFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get SettlementTransaction Params
  getSettlementTransactionParams(): any {
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

  // SettlementTransactions Pagination
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

    this.onLoadSettlementTransactionsByCriteria();
  }

  // Search Data in SettlementTransactions
  performSearchInSettlementTransactions(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allSettlementTransactions.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.settlementTransactions = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all settlementTransaction items
  checkUncheckAllSettlementTransactions(evt: any) {
    this.settlementTransactions.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedSettlementTransaction(evt);
  }

  // Check/uncheck selected settlementTransaction
  onSelectedSettlementTransaction(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.settlementTransactions.length; i++) {
      if (this.settlementTransactions[i].state == true) {
        this.CheckedDeletedIds.push(this.settlementTransactions[i].SettlementTransactionId);
      }
    }
  }

  // Sort SettlementTransactions Data
  onSortSettlementTransactions(column: any) {
    this.settlementTransactions = this.paginationService.onSort(column, this.allSettlementTransactions)
  }
}
