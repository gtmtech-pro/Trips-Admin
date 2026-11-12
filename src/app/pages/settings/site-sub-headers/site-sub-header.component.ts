import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { SiteSubHeaderModel } from './site-sub-header.model';
import { SiteSubHeaderService } from './site-sub-header.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './site-sub-header.component.html',
  styleUrls: ['./site-sub-header.component.scss'],
  standalone: false
})

export class SiteSubHeaderComponent extends BaseListComponent<SiteSubHeaderModel> implements OnInit {
  siteSubHeaderData!: FormGroup;
  siteSubHeaders: any;
  allSiteSubHeaders: any;

  constructor(
    public formBuilder: FormBuilder,
    public siteSubHeaderService: SiteSubHeaderService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Site Sub Headers', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createSiteSubHeaderFilterForm();

    this.displayedColumns = ['SiteHeaderName', 'TransactionName', 'PageTitle', 'DisplayOrder', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial siteSubHeaders data
    this.paginationService.PageIndex = 0;
    this.onLoadSiteSubHeadersByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadSiteSubHeadersByCriteria();
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

      this.onLoadSiteSubHeadersByCriteria();
    });
  }

  onLoadSiteSubHeadersByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getSiteSubHeaderParams();

    this.siteSubHeaderService.GetAllByCriteria(params).subscribe(response => {
      this.siteSubHeaders = response.Results;
      this.allSiteSubHeaders = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadSiteSubHeadersByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadSiteSubHeadersByCriteria();
  }

  onLoadSiteSubHeadersByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["SiteSubHeaderStatus"].setValue(transStatus);

    this.onLoadSiteSubHeadersByCriteria();
  }

  resetSiteSubHeadersFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadSiteSubHeadersByCriteria();
  }

  onDeleteSiteSubHeader(siteSubHeaderIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Site Sub Header')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.siteSubHeaderService.deleteSiteSubHeaderById(siteSubHeaderIds)
            .subscribe((siteSubHeaderResp: any) => {

              if (siteSubHeaderResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('SiteSubHeader deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleSiteSubHeaders(): void {
    this.onDeleteSiteSubHeader(this.CheckedDeletedIds);
  }

  exportSiteSubHeadersData(): void {
    this.showHideLoading(true);

    let params = this.getSiteSubHeaderParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.siteSubHeaderService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.SiteSubHeaderId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "SiteSubHeaders");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create SiteSubHeader Filters form and returns {FormGroup}
  createSiteSubHeaderFilterForm(): FormGroup {
    return this.formBuilder.group({
      SiteSubHeaderName: new FormControl({ value: null, disabled: false }),
      SiteSubHeaderStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get SiteSubHeader Params
  getSiteSubHeaderParams(): any {
    let transStatus = this.filterForm.controls["SiteSubHeaderStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["SiteSubHeaderName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // SiteSubHeaders Pagination
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

    this.onLoadSiteSubHeadersByCriteria();
  }

  // Search Data in SiteSubHeaders
  performSearchInSiteSubHeaders(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allSiteSubHeaders.filter((item: any) => {
      return (
        item.SiteHeaderName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.TransactionName.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.siteSubHeaders = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all siteSubHeader items
  checkUncheckAllSiteSubHeaders(evt: any) {
    this.siteSubHeaders.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedSiteSubHeader(evt);
  }

  // Check/uncheck selected siteSubHeader
  onSelectedSiteSubHeader(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.siteSubHeaders.length; i++) {
      if (this.siteSubHeaders[i].state == true) {
        this.CheckedDeletedIds.push(this.siteSubHeaders[i].SiteSubHeaderId);
      }
    }
  }

  // Sort SiteSubHeaders Data
  onSortSiteSubHeaders(column: any) {
    this.siteSubHeaders = this.paginationService.onSort(column, this.allSiteSubHeaders)
  }
}
