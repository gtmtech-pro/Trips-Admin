import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant'
import { AccountService } from '../account.service';
import { AccountModel } from '../account.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  standalone: false
})
export class CreateAccountComponent extends BaseComponent<AccountModel> implements OnInit {
  accountForm!: FormGroup;
  accountModel!: AccountModel;
  roleList!: DropdownModel[]; departmentList!: DropdownModel[];
  designationList!: DropdownModel[]; employeeList!: DropdownModel[];
  reportingToList!: DropdownModel[]; reportingTo1List!: DropdownModel[]; reportingTo2List!: DropdownModel[];
  fieldTextType: boolean = false;

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private accountService: AccountService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Admins' }, { label: 'Account', active: true }];

    // Set the default account Model
    this.accountModel = new AccountModel();
    this.accountForm = this.createAccountForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.accountService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.roleList = results[0].Results;
      }
      if (results[1].Success) {
        this.departmentList = results[1].Results;
      }
      if (results[2].Success) {
        this.designationList = results[2].Results;
      }
      if (results[3].Success) {
        this.employeeList = results[3].Results.slice();
      }
      if (results[4].Success) {
        this.reportingToList = results[4].Results.slice();
        this.reportingTo1List = results[4].Results.slice();
        this.reportingTo2List = results[4].Results.slice();
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.accountModel = new AccountModel();
            this.showHideLoading(false);

          } else {
            let accountId: string = params.get('accountId')!

            this.accountService.getAccountById(accountId)
              .subscribe((response: any) => {
                this.accountModel = response.Result;

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.accountModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.accountModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.accountForm = this.createAccountForm();
                this.accountForm.controls['AccountId'].setValue(this.accountModel.AccountId);
                this.onChangeEmployee(null);

                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  onChangeEmployee(evt: any): any {
    let employeeId = this.accountForm.controls['AccountId'].value;

    if (employeeId == null) {
      this.accountForm.controls['FirstName'].setValue(null);
      this.accountForm.controls['MiddleName'].setValue(null);
      this.accountForm.controls['LastName'].setValue(null);
      this.accountForm.controls['UserName'].setValue(null);
      this.accountForm.controls['Mobile'].setValue(null);
      this.accountForm.controls['EmailId'].setValue(null);
      this.accountForm.controls['DepartmentId'].setValue(null);
      this.accountForm.controls['DesignationId'].setValue(null);
      return;
    }

    this.showHideLoading(true);
    this.accountService.getEmployeeDetailsById(employeeId).subscribe((response: any) => {
      let employeeModel = response.Result;

      this.accountForm.controls['FirstName'].setValue(employeeModel.FirstName);
      this.accountForm.controls['MiddleName'].setValue(employeeModel.MiddleName);
      this.accountForm.controls['LastName'].setValue(employeeModel.LastName);
      this.accountForm.controls['UserName'].setValue(employeeModel.EmployeeName);
      this.accountForm.controls['Mobile'].setValue(employeeModel.Mobile);
      this.accountForm.controls['EmailId'].setValue(employeeModel.EmailId);
      this.accountForm.controls['DepartmentId'].setValue(employeeModel.DepartmentId);
      this.accountForm.controls['DesignationId'].setValue(employeeModel.DesignationId);

      this.showHideLoading(false);
    }, (error: any) => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  saveOrUpdateAccountDetails() {
    if (!this.accountForm.valid) {
      this.validateAllFormFields(this.accountForm);
      return;
    }

    this.setValueFromFormGroup(this.accountForm, this.accountModel);

    this.showHideLoading(true);
    this.accountService.createOrUpdateAccount(this.accountModel)
      .subscribe((accountResp: any) => {

        if (accountResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Account.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(accountResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Account deletion errors =>', error);
      });
  }

  //Create account form and returns {FormGroup}
  createAccountForm(): FormGroup {
    return this.formBuilder.group({
      AccountId: new FormControl({ value: this.accountModel.AccountId, disabled: (this.PageRights.ActionType != this.Constants.Actions.New) }, [Validators.required]),
      LoginId: new FormControl({ value: this.accountModel.LoginId, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(100)]),
      Password: new FormControl({ value: this.accountModel.Password, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50), Validators.pattern(this.Constants.Regex.Password)]),
      UserName: new FormControl({ value: this.accountModel.UserName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(150)]),
      FirstName: new FormControl({ value: this.accountModel.FirstName, disabled: true }, [Validators.required, Validators.maxLength(50)]),
      MiddleName: new FormControl({ value: this.accountModel.MiddleName, disabled: true }, [Validators.maxLength(50)]),
      LastName: new FormControl({ value: this.accountModel.LastName, disabled: true }, [Validators.required, Validators.maxLength(50)]),
      DepartmentId: new FormControl({ value: this.accountModel.DepartmentId, disabled: true }, [Validators.required, Validators.maxLength(50)]),
      DesignationId: new FormControl({ value: this.accountModel.DesignationId, disabled: true }, [Validators.required, Validators.maxLength(50)]),
      RoleId: new FormControl({ value: this.accountModel.RoleId, disabled: this.PageRights.IsReadOnly }, Validators.required),
      ReportingToId: new FormControl({ value: this.accountModel.ReportingToId, disabled: this.PageRights.IsReadOnly }, Validators.required),
      ReportingTo1Id: new FormControl({ value: this.accountModel.ReportingTo1Id, disabled: this.PageRights.IsReadOnly }),
      ReportingTo2Id: new FormControl({ value: this.accountModel.ReportingTo2Id, disabled: this.PageRights.IsReadOnly }),
      EmailId: new FormControl({ value: this.accountModel.EmailId, disabled: true }, [Validators.maxLength(100), Validators.pattern(this.Constants.Regex.Email)]),
      Mobile: new FormControl({ value: this.accountModel.Mobile, disabled: true }, [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(this.Constants.Regex.MobileNumber)]),
      IsLocked: new FormControl({ value: this.accountModel.IsLocked, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.accountModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Account form data
  get form(): any {
    return this.accountForm.controls;
  }
}
