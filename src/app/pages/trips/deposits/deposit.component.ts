import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { DepositModel } from './deposit.model';
import { DepositService } from './deposit.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
  standalone: false
})

export class DepositComponent extends BaseListComponent<DepositModel> implements OnInit {
  depositData!: FormGroup;
  deposits: any;
  allDeposits: any;

  constructor(
    public formBuilder: FormBuilder,
    public depositService: DepositService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Deposits', active: true }];

    this.filterForm = this.createDepositFilterForm();

    this.displayedColumns = ['TripName', 'TripMemberName', 'Amount', 'BaseAmount', 'DepositDate', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial deposits data
    this.paginationService.PageIndex = 0;
    this.onLoadDepositsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadDepositsByCriteria();
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

      this.onLoadDepositsByCriteria();
    });
  }

  onLoadDepositsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getDepositParams();

    this.depositService.GetAllByCriteria(params).subscribe(response => {
      this.deposits = response.Results;
      this.allDeposits = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadDepositsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadDepositsByCriteria();
  }

  onLoadDepositsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadDepositsByCriteria();
  }

  resetDepositsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadDepositsByCriteria();
  }

  onDeleteDeposit(depositIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Deposit')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.depositService.deleteDepositById(depositIds)
            .subscribe((depositResp: any) => {

              if (depositResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Deposit deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleDeposits(): void {
    this.onDeleteDeposit(this.CheckedDeletedIds);
  }

  exportDepositsData(): void {
    this.showHideLoading(true);

    let params = this.getDepositParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.depositService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.DepositId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Deposits");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Deposit Filters form and returns {FormGroup}
  createDepositFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Deposit Params
  getDepositParams(): any {
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

  // Deposits Pagination
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

    this.onLoadDepositsByCriteria();
  }

  // Search Data in Deposits
  performSearchInDeposits(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allDeposits.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.deposits = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all deposit items
  checkUncheckAllDeposits(evt: any) {
    this.deposits.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedDeposit(evt);
  }

  // Check/uncheck selected deposit
  onSelectedDeposit(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.deposits.length; i++) {
      if (this.deposits[i].state == true) {
        this.CheckedDeletedIds.push(this.deposits[i].DepositId);
      }
    }
  }

  // Sort Deposits Data
  onSortDeposits(column: any) {
    this.deposits = this.paginationService.onSort(column, this.allDeposits)
  }
}
