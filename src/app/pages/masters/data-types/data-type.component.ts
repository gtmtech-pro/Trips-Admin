import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { PaginationService } from '../../../core/services/pagination.service';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { DataTypeService } from './data-type.service';
import { DataTypeModel } from './data-type.model';

@Component({
  selector: 'data-list-view',
  templateUrl: './data-type.component.html',
  styleUrls: ['./data-type.component.scss'],
  standalone: false
})

export class DataTypeComponent extends BaseListComponent<DataTypeModel> implements OnInit {
  dataTypeData!: FormGroup;
  dataTypes: any;
  allDataTypes: any;

  constructor(
    public formBuilder: FormBuilder,
    public dataTypeService: DataTypeService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Masters' }, { label: 'Data Types', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createDataTypeFilterForm();

    this.displayedColumns = ['Name', 'Description', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial dataTypes data
    this.paginationService.PageIndex = 0;
    this.onLoadDataTypesByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadDataTypesByCriteria();
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

      this.onLoadDataTypesByCriteria();
    });
  }

  onLoadDataTypesByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getDataTypeParams();

    this.dataTypeService.GetAllByCriteria(params).subscribe(response => {
      this.dataTypes = response.Results;
      this.allDataTypes = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadDataTypesByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadDataTypesByCriteria();
  }

  onLoadDataTypesByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["DataTypeStatus"].setValue(transStatus);

    this.onLoadDataTypesByCriteria();
  }

  resetDataTypesFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadDataTypesByCriteria();
  }

  onDeleteDataType(dataTypeIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, "Data Types")
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.dataTypeService.deleteDataTypeById(dataTypeIds)
            .subscribe((dataTypeResp: any) => {

              if (dataTypeResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('DataType deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleDataTypes(): void {
    this.onDeleteDataType(this.CheckedDeletedIds);
  }

  exportDataTypesData(): void {
    this.showHideLoading(true);

    let params = this.getDataTypeParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.dataTypeService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.DataTypeId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "DataTypes");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create DataType Filters form and returns {FormGroup}
  createDataTypeFilterForm(): FormGroup {
    return this.formBuilder.group({
      DataTypeName: new FormControl({ value: null, disabled: false }),
      DataTypeStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get DataType Params
  getDataTypeParams(): any {
    let transStatus = this.filterForm.controls["DataTypeStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["DataTypeName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // DataTypes Pagination
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

    this.onLoadDataTypesByCriteria();
  }

  // Search Data in DataTypes
  performSearchInDataTypes(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allDataTypes.filter((item: any) => {
      return (
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Description.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.dataTypes = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all dataType items
  checkUncheckAllDataTypes(evt: any) {
    this.dataTypes.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedDataType(evt);
  }

  // Check/uncheck selected dataType
  onSelectedDataType(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.dataTypes.length; i++) {
      if (this.dataTypes[i].state == true) {
        this.CheckedDeletedIds.push(this.dataTypes[i].DataTypeId);
      }
    }
  }

  // Sort DataTypes Data
  onSortDataTypes(column: any) {
    this.dataTypes = this.paginationService.onSort(column, this.allDataTypes)
  }
}
