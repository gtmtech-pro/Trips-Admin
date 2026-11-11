import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant'
import { RoleTransactionService } from '../role-transaction.service';
import { RoleTransactionModel } from '../role-transaction.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'role-transaction',
  templateUrl: './create-role-transaction.component.html',
  styleUrls: ['./create-role-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CreateRoleTransactionComponent extends BaseComponent<RoleTransactionModel> implements OnInit {
  roleTransactionForm!: FormGroup;
  roleTransactionModel!: RoleTransactionModel;
  roleList!: DropdownModel[]; departmentList!: DropdownModel[];
  designationList!: DropdownModel[]; filteredDesignationItems!: DropdownModel[]; transactionList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private roleTransactionService: RoleTransactionService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Role Transaction', active: true }];

    // Set the default roleTransaction Model
    this.roleTransactionModel = new RoleTransactionModel();
    this.roleTransactionForm = this.createRoleTransactionForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.roleTransactionService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.roleList = results[0].Results;
      }
      if (results[1].Success) {
        this.departmentList = results[1].Results;
      }
      if (results[2].Success) {
        this.designationList = results[2].Results;
        this.filteredDesignationItems = this.designationList.slice();
      }
      if (results[3].Success) {
        this.transactionList = results[3].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.roleTransactionModel = new RoleTransactionModel();
            this.showHideLoading(false);

          } else {
            let roleTransactionId: string = params.get('roleTransactionId')!

            this.roleTransactionService.getRoleTransactionById(roleTransactionId)
              .subscribe((response: any) => {
                this.roleTransactionModel = new RoleTransactionModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.roleTransactionModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.roleTransactionModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.roleTransactionForm = this.createRoleTransactionForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  onChangeDepartment(event: any) {
    if (event != undefined) {
      this.filteredDesignationItems = this.designationList.filter(x => x.Description == event.Id);
    }
    else {
      this.filteredDesignationItems = [];
      this.roleTransactionForm.controls['DesignationId'].setValue(null);
    }

    this.filteredDesignationItems.unshift({ Id: null, Name: "Select Designation", Description: 'Designation', SequenceNo: 1, IsDisabled: false, IsSelected: true });
  }

  saveOrUpdateRoleTransactionDetails() {
    if (!this.roleTransactionForm.valid) {
      this.validateAllFormFields(this.roleTransactionForm);
      return;
    }

    this.setValueFromFormGroup(this.roleTransactionForm, this.roleTransactionModel);

    this.showHideLoading(true);
    this.roleTransactionService.createOrUpdateRoleTransaction(this.roleTransactionModel)
      .subscribe((roleTransactionResp: any) => {

        if (roleTransactionResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.RoleTransaction.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(roleTransactionResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('RoleTransaction deletion errors =>', error);
      });
  }

  //Create roleTransaction form and returns {FormGroup}
  createRoleTransactionForm(): FormGroup {
    return this.formBuilder.group({
      RoleTransactionId: new FormControl(this.roleTransactionModel.RoleTransactionId),
      RoleId: new FormControl({ value: this.roleTransactionModel.RoleId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      DepartmentId: new FormControl({ value: this.roleTransactionModel.DepartmentId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      DesignationId: new FormControl({ value: this.roleTransactionModel.DesignationId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TransactionId: new FormControl({ value: this.roleTransactionModel.TransactionId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Rights: new FormControl({ value: this.roleTransactionModel.Rights, disabled: this.PageRights.IsReadOnly }),
      CanAdd: new FormControl({ value: this.roleTransactionModel.CanAdd, disabled: this.PageRights.IsReadOnly }),
      CanEdit: new FormControl({ value: this.roleTransactionModel.CanEdit, disabled: this.PageRights.IsReadOnly }),
      CanDelete: new FormControl({ value: this.roleTransactionModel.CanDelete, disabled: this.PageRights.IsReadOnly }),
      CanView: new FormControl({ value: this.roleTransactionModel.CanView, disabled: this.PageRights.IsReadOnly }),
      CanExport: new FormControl({ value: this.roleTransactionModel.CanExport, disabled: this.PageRights.IsReadOnly }),
      CanChild: new FormControl({ value: this.roleTransactionModel.CanChild, disabled: this.PageRights.IsReadOnly }),
      CanRemark: new FormControl({ value: this.roleTransactionModel.CanRemark, disabled: this.PageRights.IsReadOnly }),
      ListView: new FormControl({ value: this.roleTransactionModel.ListView, disabled: this.PageRights.IsReadOnly }),
      BasicView: new FormControl({ value: this.roleTransactionModel.BasicView, disabled: this.PageRights.IsReadOnly }),
      DetailView: new FormControl({ value: this.roleTransactionModel.DetailView, disabled: this.PageRights.IsReadOnly }),
      IsPublic: new FormControl({ value: this.roleTransactionModel.IsPublic, disabled: this.PageRights.IsReadOnly }),
      Remarks: new FormControl({ value: this.roleTransactionModel.Remarks, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.roleTransactionModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns RoleTransaction form data
  get form(): any {
    return this.roleTransactionForm.controls;
  }
}
