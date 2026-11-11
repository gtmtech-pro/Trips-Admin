import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { RoleModel } from './role.model';
import { RoleService } from './role.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  standalone: false
})

export class RoleComponent extends BaseListComponent<RoleModel> implements OnInit {
  roleData!: FormGroup;
  roles: any;
  allRoles: any;

  constructor(
    public formBuilder: FormBuilder,
    public roleService: RoleService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Roles', active: true }];

    this.searchForm = this.formBuilder.group({ SearchText: new FormControl({ value: '', disabled: false }) });
    this.filterForm = this.createRoleFilterForm();

    this.displayedColumns = ['Code', 'Name', 'Description', 'LandingPageUrl', 'Remarks', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial roles data
    this.paginationService.PageIndex = 0;
    this.onLoadRolesByCriteria();
  }

  onLoadRolesByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getRoleParams();

    this.roleService.GetAllByCriteria(params).subscribe(response => {
      this.roles = response.Results;
      this.allRoles = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadRolesByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadRolesByCriteria();
  }

  onLoadRolesByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["RoleStatus"].setValue(transStatus);

    this.onLoadRolesByCriteria();
  }

  resetRolesFilters(): void {
    this.paginationService.PageIndex = 0;
    this.searchForm.reset();
    this.filterForm.reset();

    this.onLoadRolesByCriteria();
  }

  onDeleteRole(roleIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, "Role")
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.roleService.deleteRoleById(roleIds)
            .subscribe((roleResp: any) => {

              if (roleResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('Role deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleRoles(): void {
    this.onDeleteRole(this.CheckedDeletedIds);
  }

  exportRolesData(): void {
    this.showHideLoading(true);

    let params = this.getRoleParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.roleService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.RoleId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "Roles");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create Role Filters form and returns {FormGroup}
  createRoleFilterForm(): FormGroup {
    return this.formBuilder.group({
      RoleName: new FormControl({ value: null, disabled: false }),
      RoleStatus: new FormControl({ value: null, disabled: false })
    });
  }

  // Get Role Params
  getRoleParams(): any {
    let transStatus = this.filterForm.controls["RoleStatus"].value;

    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["RoleName"].value,
      Status: ((transStatus != null) ? JSON.parse(transStatus) : null),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // Roles Pagination
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

    this.onLoadRolesByCriteria();
  }

  // Search Data in Roles
  performSearchInRoles(): void {
    let searchText = this.searchForm.controls['SearchText'].value;

    let searchResults = this.allRoles.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.roles = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all role items
  checkUncheckAllRoles(evt: any) {
    this.roles.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedRole(evt);
  }

  // Check/uncheck selected role
  onSelectedRole(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.roles.length; i++) {
      if (this.roles[i].state == true) {
        this.CheckedDeletedIds.push(this.roles[i].RoleId);
      }
    }
  }

  // Sort Roles Data
  onSortRoles(column: any) {
    this.roles = this.paginationService.onSort(column, this.allRoles)
  }
}
