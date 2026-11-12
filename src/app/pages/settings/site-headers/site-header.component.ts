import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { SiteHeaderModel } from './site-header.model';
import { SiteHeaderService } from './site-header.service';
import { ShowDialogService } from '../../../shared/show-dialog.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
  standalone: false
})

export class SiteHeaderComponent extends BaseListComponent<SiteHeaderModel> implements OnInit {
  siteHeaderData!: FormGroup;
  siteHeaders: any;
  allSiteHeaders: any;

  constructor(
    public formBuilder: FormBuilder,
    public siteHeaderService: SiteHeaderService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Site Headers', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createSiteHeaderFilterForm();

    this.displayedColumns = ['HeaderName', 'ParentHeaderName', 'Description', 'DisplayOrder', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial siteHeaders data
    this.paginationService.PageIndex = 0;
    this.onLoadSiteHeadersByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadSiteHeadersByCriteria();
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

      this.onLoadSiteHeadersByCriteria();
    });
  }

  onLoadSiteHeadersByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getSiteHeaderParams();

    this.siteHeaderService.GetAllByCriteria(params).subscribe(response => {
      this.siteHeaders = response.Results;
      this.allSiteHeaders = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadSiteHeadersByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadSiteHeadersByCriteria();
  }

  onLoadSiteHeadersByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["SiteHeaderStatus"].setValue(transStatus);

    this.onLoadSiteHeadersByCriteria();
  }

  resetSiteHeadersFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadSiteHeadersByCriteria();
  }

  onDeleteSiteHeader(siteHeaderIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'Site Header')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.siteHeaderService.deleteSiteHeaderById(siteHeaderIds)
            .subscribe((siteHeaderResp: any) => {

              if (siteHeaderResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('SiteHeader deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleSiteHeaders(): void {
    this.onDeleteSiteHeader(this.CheckedDeletedIds);
  }

  exportSiteHeadersData(): void {
    this.showHideLoading(true);

    let params = this.getSiteHeaderParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.siteHeaderService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.SiteHeaderId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "SiteHeaders");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create SiteHeader Filters form and returns {FormGroup}
  createSiteHeaderFilterForm(): FormGroup {
    return this.formBuilder.group({
      SiteHeaderName: new FormControl({ value: null, disabled: false }),
      SiteHeaderStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get SiteHeader Params
  getSiteHeaderParams(): any {
    let transStatus = this.filterForm.controls["SiteHeaderStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["SiteHeaderName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // SiteHeaders Pagination
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

    this.onLoadSiteHeadersByCriteria();
  }

  // Search Data in SiteHeaders
  performSearchInSiteHeaders(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allSiteHeaders.filter((item: any) => {
      return (
        item.HeaderName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.ParentHeaderName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Description.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.siteHeaders = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all siteHeader items
  checkUncheckAllSiteHeaders(evt: any) {
    this.siteHeaders.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedSiteHeader(evt);
  }

  // Check/uncheck selected siteHeader
  onSelectedSiteHeader(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.siteHeaders.length; i++) {
      if (this.siteHeaders[i].state == true) {
        this.CheckedDeletedIds.push(this.siteHeaders[i].SiteHeaderId);
      }
    }
  }

  // Sort SiteHeaders Data
  onSortSiteHeaders(column: any) {
    this.siteHeaders = this.paginationService.onSort(column, this.allSiteHeaders)
  }
}
