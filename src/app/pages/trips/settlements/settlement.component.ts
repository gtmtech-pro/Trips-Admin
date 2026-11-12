import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { SettlementModel } from './settlement.model';
import { SettlementService } from './settlement.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss'],
  standalone: false
})

export class SettlementComponent extends BaseListComponent<SettlementModel> implements OnInit {
  settlementData!: FormGroup;
  settlements: any;
  allSettlements: any;

  constructor(
    public formBuilder: FormBuilder,
    public settlementService: SettlementService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Settlements', active: true }];

    this.filterForm = this.createSettlementFilterForm();

    this.displayedColumns = ['TripName', 'TripMemberName', 'TripMemberName', 'Amount', 'PaymentMethod', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial settlements data
    this.paginationService.PageIndex = 0;
    this.onLoadSettlementsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadSettlementsByCriteria();
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

      this.onLoadSettlementsByCriteria();
    });
  }

  onLoadSettlementsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getSettlementParams();

    this.settlementService.GetAllByCriteria(params).subscribe(response => {
      this.settlements = response.Results;
      this.allSettlements = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadSettlementsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadSettlementsByCriteria();
  }

  onLoadSettlementsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadSettlementsByCriteria();
  }

  resetSettlementsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadSettlementsByCriteria();
  }

  onDeleteSettlement(settlementIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Settlement')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.settlementService.deleteSettlementById(settlementIds)
            .subscribe((settlementResp: any) => {

              if (settlementResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Settlement deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleSettlements(): void {
    this.onDeleteSettlement(this.CheckedDeletedIds);
  }

  exportSettlementsData(): void {
    this.showHideLoading(true);

    let params = this.getSettlementParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.settlementService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.SettlementId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Settlements");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Settlement Filters form and returns {FormGroup}
  createSettlementFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Settlement Params
  getSettlementParams(): any {
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

  // Settlements Pagination
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

    this.onLoadSettlementsByCriteria();
  }

  // Search Data in Settlements
  performSearchInSettlements(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allSettlements.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.settlements = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all settlement items
  checkUncheckAllSettlements(evt: any) {
    this.settlements.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedSettlement(evt);
  }

  // Check/uncheck selected settlement
  onSelectedSettlement(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.settlements.length; i++) {
      if (this.settlements[i].state == true) {
        this.CheckedDeletedIds.push(this.settlements[i].SettlementId);
      }
    }
  }

  // Sort Settlements Data
  onSortSettlements(column: any) {
    this.settlements = this.paginationService.onSort(column, this.allSettlements)
  }
}
