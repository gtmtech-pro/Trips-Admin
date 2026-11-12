import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { PaginationService } from '../../../core/services/pagination.service';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { DataValueService } from './data-value.service';
import { DataValueModel } from './data-value.model';

@Component({
  selector: 'data-list-view',
  templateUrl: './data-value.component.html',
  styleUrls: ['./data-value.component.scss'],
  standalone: false
})

export class DataValueComponent extends BaseListComponent<DataValueModel> implements OnInit {
  dataValueData!: FormGroup;
  dataValues: any;
  allDataValues: any;
  dataTypeList: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public dataValueService: DataValueService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Masters' }, { label: 'Data Values', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createDataValueFilterForm();

    this.displayedColumns = ['DataTypeName', 'ParentId', 'Code', 'Name', 'Description', 'DisplayOrder', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    this.dataValueService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.dataTypeList = results[0].Results;
      }

      //Load initial dataValues data
      this.paginationService.PageIndex = 0;
      this.onLoadDataValuesByCriteria();
    });

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadDataValuesByCriteria();
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

      this.onLoadDataValuesByCriteria();
    });
  }

  onLoadDataValuesByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getDataValueParams();

    this.dataValueService.GetAllByCriteria(params).subscribe(response => {
      this.dataValues = response.Results;
      this.allDataValues = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadDataValuesByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadDataValuesByCriteria();
  }

  onLoadDataValuesByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["DataValueStatus"].setValue(transStatus);

    this.onLoadDataValuesByCriteria();
  }

  resetDataValuesFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadDataValuesByCriteria();
  }

  onDeleteDataValue(dataValueIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, "Data Values")
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.dataValueService.deleteDataValueById(dataValueIds)
            .subscribe((dataValueResp: any) => {

              if (dataValueResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('DataValue deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleDataValues(): void {
    this.onDeleteDataValue(this.CheckedDeletedIds);
  }

  exportDataValuesData(): void {
    this.showHideLoading(true);

    let params = this.getDataValueParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.dataValueService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.DataValueId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "DataValues");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create DataValue Filters form and returns {FormGroup}
  createDataValueFilterForm(): FormGroup {
    return this.formBuilder.group({
      DataTypeId: new FormControl({ value: null, disabled: false }),
      DataValueName: new FormControl({ value: null, disabled: false }),
      DataValueStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get DataValue Params
  getDataValueParams(): any {
    let transStatus = this.filterForm.controls["DataValueStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      DataTypeId: this.filterForm.controls["DataTypeId"].value,
      Name: this.filterForm.controls["DataValueName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // DataValues Pagination
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

    this.onLoadDataValuesByCriteria();
  }

  // Search Data in DataValues
  performSearchInDataValues(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allDataValues.filter((item: any) => {
      return (
        item.DataTypeName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.dataValues = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all dataValue items
  checkUncheckAllDataValues(evt: any) {
    this.dataValues.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedDataValue(evt);
  }

  // Check/uncheck selected dataValue
  onSelectedDataValue(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.dataValues.length; i++) {
      if (this.dataValues[i].state == true) {
        this.CheckedDeletedIds.push(this.dataValues[i].DataValueId);
      }
    }
  }

  // Sort DataValues Data
  onSortDataValues(column: any) {
    this.dataValues = this.paginationService.onSort(column, this.allDataValues)
  }
}
