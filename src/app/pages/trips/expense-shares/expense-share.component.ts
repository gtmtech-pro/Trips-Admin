import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { ExpenseShareModel } from './expense-share.model';
import { ExpenseShareService } from './expense-share.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './expense-share.component.html',
  styleUrls: ['./expense-share.component.scss'],
  standalone: false
})

export class ExpenseShareComponent extends BaseListComponent<ExpenseShareModel> implements OnInit {
  expenseShareData!: FormGroup;
  expenseShares: any;
  allExpenseShares: any;

  constructor(
    public formBuilder: FormBuilder,
    public expenseShareService: ExpenseShareService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Expense Shares', active: true }];

    this.filterForm = this.createExpenseShareFilterForm();

    this.displayedColumns = ['ExpensName', 'TripMemberName', 'ShareAmount', 'Percentage', 'ShareUnits', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial expenseShares data
    this.paginationService.PageIndex = 0;
    this.onLoadExpenseSharesByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadExpenseSharesByCriteria();
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

      this.onLoadExpenseSharesByCriteria();
    });
  }

  onLoadExpenseSharesByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getExpenseShareParams();

    this.expenseShareService.GetAllByCriteria(params).subscribe(response => {
      this.expenseShares = response.Results;
      this.allExpenseShares = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadExpenseSharesByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadExpenseSharesByCriteria();
  }

  onLoadExpenseSharesByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadExpenseSharesByCriteria();
  }

  resetExpenseSharesFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadExpenseSharesByCriteria();
  }

  onDeleteExpenseShare(expenseShareIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'ExpenseShare')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.expenseShareService.deleteExpenseShareById(expenseShareIds)
            .subscribe((expenseShareResp: any) => {

              if (expenseShareResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('ExpenseShare deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleExpenseShares(): void {
    this.onDeleteExpenseShare(this.CheckedDeletedIds);
  }

  exportExpenseSharesData(): void {
    this.showHideLoading(true);

    let params = this.getExpenseShareParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.expenseShareService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.ExpenseShareId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "ExpenseShares");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create ExpenseShare Filters form and returns {FormGroup}
  createExpenseShareFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get ExpenseShare Params
  getExpenseShareParams(): any {
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

  // ExpenseShares Pagination
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

    this.onLoadExpenseSharesByCriteria();
  }

  // Search Data in ExpenseShares
  performSearchInExpenseShares(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allExpenseShares.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.expenseShares = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all expenseShare items
  checkUncheckAllExpenseShares(evt: any) {
    this.expenseShares.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedExpenseShare(evt);
  }

  // Check/uncheck selected expenseShare
  onSelectedExpenseShare(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.expenseShares.length; i++) {
      if (this.expenseShares[i].state == true) {
        this.CheckedDeletedIds.push(this.expenseShares[i].ExpenseShareId);
      }
    }
  }

  // Sort ExpenseShares Data
  onSortExpenseShares(column: any) {
    this.expenseShares = this.paginationService.onSort(column, this.allExpenseShares)
  }
}
