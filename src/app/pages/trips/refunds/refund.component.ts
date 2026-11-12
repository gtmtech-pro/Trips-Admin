import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { RefundModel } from './refund.model';
import { RefundService } from './refund.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss'],
  standalone: false
})

export class RefundComponent extends BaseListComponent<RefundModel> implements OnInit {
  refundData!: FormGroup;
  refunds: any;
  allRefunds: any;

  constructor(
    public formBuilder: FormBuilder,
    public refundService: RefundService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Refunds', active: true }];

    this.filterForm = this.createRefundFilterForm();

    this.displayedColumns = ['TripId', 'OriginalExpenseId', 'ReceivedByTripMemberId', 'Amount', 'BaseAmount', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial refunds data
    this.paginationService.PageIndex = 0;
    this.onLoadRefundsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadRefundsByCriteria();
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

      this.onLoadRefundsByCriteria();
    });
  }

  onLoadRefundsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getRefundParams();

    this.refundService.GetAllByCriteria(params).subscribe(response => {
      this.refunds = response.Results;
      this.allRefunds = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadRefundsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadRefundsByCriteria();
  }

  onLoadRefundsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadRefundsByCriteria();
  }

  resetRefundsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadRefundsByCriteria();
  }

  onDeleteRefund(refundIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Refund')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.refundService.deleteRefundById(refundIds)
            .subscribe((refundResp: any) => {

              if (refundResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Refund deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleRefunds(): void {
    this.onDeleteRefund(this.CheckedDeletedIds);
  }

  exportRefundsData(): void {
    this.showHideLoading(true);

    let params = this.getRefundParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.refundService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.RefundId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Refunds");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Refund Filters form and returns {FormGroup}
  createRefundFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Refund Params
  getRefundParams(): any {
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

  // Refunds Pagination
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

    this.onLoadRefundsByCriteria();
  }

  // Search Data in Refunds
  performSearchInRefunds(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allRefunds.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.refunds = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all refund items
  checkUncheckAllRefunds(evt: any) {
    this.refunds.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedRefund(evt);
  }

  // Check/uncheck selected refund
  onSelectedRefund(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.refunds.length; i++) {
      if (this.refunds[i].state == true) {
        this.CheckedDeletedIds.push(this.refunds[i].RefundId);
      }
    }
  }

  // Sort Refunds Data
  onSortRefunds(column: any) {
    this.refunds = this.paginationService.onSort(column, this.allRefunds)
  }
}
