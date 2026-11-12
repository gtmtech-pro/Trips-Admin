import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { PaginationService } from '../../../core/services/pagination.service';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { AppSettingService } from './app-setting.service';
import { AppSettingModel } from './app-setting.model';

@Component({
  selector: 'data-list-view',
  templateUrl: './app-setting.component.html',
  styleUrls: ['./app-setting.component.scss'],
  standalone: false
})

export class AppSettingComponent extends BaseListComponent<AppSettingModel> implements OnInit {
  appSettingData!: FormGroup;
  appSettings: any;
  allAppSettings: any;

  constructor(
    public formBuilder: FormBuilder,
    public appSettingService: AppSettingService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Masters' }, { label: 'App Settings', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createAppSettingFilterForm();

    this.displayedColumns = ['SettingType', 'SettingName', 'SettingLabel', 'SettingValue', 'FormattedValue', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial appSettings data
    this.paginationService.PageIndex = 0;
    this.onLoadAppSettingsByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadAppSettingsByCriteria();
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

      this.onLoadAppSettingsByCriteria();
    });
  }

  onLoadAppSettingsByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getAppSettingParams();

    this.appSettingService.GetAllByCriteria(params).subscribe(response => {
      this.appSettings = response.Results;
      this.allAppSettings = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadAppSettingsByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadAppSettingsByCriteria();
  }

  onLoadAppSettingsByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["AppSettingStatus"].setValue(transStatus);

    this.onLoadAppSettingsByCriteria();
  }

  resetAppSettingsFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadAppSettingsByCriteria();
  }

  onDeleteAppSetting(appSettingIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Trip Settings')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.appSettingService.deleteAppSettingById(appSettingIds)
            .subscribe((appSettingResp: any) => {

              if (appSettingResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('AppSetting deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleAppSettings(): void {
    this.onDeleteAppSetting(this.CheckedDeletedIds);
  }

  exportAppSettingsData(): void {
    this.showHideLoading(true);

    let params = this.getAppSettingParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.appSettingService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.SettingId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "AppSettings");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create AppSetting Filters form and returns {FormGroup}
  createAppSettingFilterForm(): FormGroup {
    return this.formBuilder.group({
      AppSettingName: new FormControl({ value: null, disabled: false }),
      AppSettingStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get AppSetting Params
  getAppSettingParams(): any {
    let transStatus = this.filterForm.controls["AppSettingStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["AppSettingName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // AppSettings Pagination
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

    this.onLoadAppSettingsByCriteria();
  }

  // Search Data in AppSettings
  performSearchInAppSettings(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allAppSettings.filter((item: any) => {
      return (
        item.SettingType.toLowerCase().includes(searchText.toLowerCase()) ||
        item.SettingName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.SettingValue.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.appSettings = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all appSetting items
  checkUncheckAllAppSettings(evt: any) {
    this.appSettings.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedAppSetting(evt);
  }

  // Check/uncheck selected appSetting
  onSelectedAppSetting(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.appSettings.length; i++) {
      if (this.appSettings[i].state == true) {
        this.CheckedDeletedIds.push(this.appSettings[i].SettingId);
      }
    }
  }

  // Sort AppSettings Data
  onSortAppSettings(column: any) {
    this.appSettings = this.paginationService.onSort(column, this.allAppSettings)
  }
}
