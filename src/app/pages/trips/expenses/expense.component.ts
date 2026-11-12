import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { ExpenseModel } from './expense.model';
import { ExpenseService } from './expense.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  standalone: false
})

export class ExpenseComponent extends BaseListComponent<ExpenseModel> implements OnInit {
  expenseData!: FormGroup;
  expenses: any;
  allExpenses: any;

  constructor(
    public formBuilder: FormBuilder,
    public expenseService: ExpenseService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Expenses', active: true }];

    this.filterForm = this.createExpenseFilterForm();

    this.displayedColumns = ['TripName', 'ExpenseCategoryName', 'ExpenseTitle', 'Description', 'TripMemberName', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial expens data
    this.paginationService.PageIndex = 0;
    this.onLoadExpensesByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadExpensesByCriteria();
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

      this.onLoadExpensesByCriteria();
    });
  }

  onLoadExpensesByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getExpenseParams();

    this.expenseService.GetAllByCriteria(params).subscribe(response => {
      this.expenses = response.Results;
      this.allExpenses = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadExpensesByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadExpensesByCriteria();
  }

  onLoadExpensesByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadExpensesByCriteria();
  }

  resetExpensesFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadExpensesByCriteria();
  }

  onDeleteExpenses(expenseIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Expenses Deletion')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.expenseService.deleteExpenseById(expenseIds)
            .subscribe((expenseResp: any) => {

              if (expenseResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Expenses deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleExpenses(): void {
    this.onDeleteExpenses(this.CheckedDeletedIds);
  }

  exportExpenseData(): void {
    this.showHideLoading(true);

    let params = this.getExpenseParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.expenseService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.ExpenseId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Expenses");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Expenses Filters form and returns {FormGroup}
  createExpenseFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Expense Params
  getExpenseParams(): any {
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

  // Expenses Pagination
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

    this.onLoadExpensesByCriteria();
  }

  // Search Data in Expenses
  performSearchInExpenses(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allExpenses.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.expenses = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all expenses items
  checkUncheckAllExpenses(evt: any) {
    this.expenses.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedExpenses(evt);
  }

  // Check/uncheck selected expenses
  onSelectedExpenses(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.expenses.length; i++) {
      if (this.expenses[i].state == true) {
        this.CheckedDeletedIds.push(this.expenses[i].ExpenseId);
      }
    }
  }

  // Sort Expenses Data
  onSortExpenses(column: any) {
    this.expenses = this.paginationService.onSort(column, this.allExpenses)
  }
}
