import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant'
import { RoleService } from '../role.service';
import { RoleModel } from '../role.model';

@Component({
  selector: 'role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CreateRoleComponent extends BaseComponent<RoleModel> implements OnInit {
  roleForm!: FormGroup;
  roleModel!: RoleModel;

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private roleService: RoleService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Role', active: true }];

    // Set the default role Model
    this.roleModel = new RoleModel();
    this.roleForm = this.createRoleForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.PageRights.ActionType = params.get('actionType')!;

        if (this.PageRights.ActionType == this.Constants.Actions.New) {
          this.roleModel = new RoleModel();
          this.showHideLoading(false);

        } else {
          let roleId: string = params.get('roleId')!

          this.roleService.getRoleById(roleId)
            .subscribe((response: any) => {
              this.roleModel = response.Result;

              if (this.PageRights.ActionType == this.Constants.Actions.New)
                this.roleModel.RequestType = this.Constants.PageType.New;
              if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                this.roleModel.RequestType = this.Constants.PageType.Edit;
              else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                this.roleModel.RequestType = this.Constants.PageType.View;
                this.PageRights.IsReadOnly = true;
              }

              this.roleForm = this.createRoleForm();
              this.showHideLoading(false);
            });
        }
      }
    });
  }

  saveOrUpdateRoleDetails() {
    if (!this.roleForm.valid) {
      this.validateAllFormFields(this.roleForm);
      return;
    }

    this.setValueFromFormGroup(this.roleForm, this.roleModel);

    this.showHideLoading(true);
    this.roleService.createOrUpdateRole(this.roleModel)
      .subscribe((roleResp: any) => {

        if (roleResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Role.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(roleResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Role deletion errors =>', error);
      });
  }

  //Create role form and returns {FormGroup}
  createRoleForm(): FormGroup {
    return this.formBuilder.group({
      RoleId: new FormControl(this.roleModel.RoleId),
      Code: new FormControl({ value: this.roleModel.Code, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(15)]),
      Name: new FormControl({ value: this.roleModel.Name, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      Description: new FormControl({ value: this.roleModel.Description, disabled: this.PageRights.IsReadOnly }),
      LandingPageUrl: new FormControl({ value: this.roleModel.LandingPageUrl, disabled: this.PageRights.IsReadOnly }),
      Remarks: new FormControl({ value: this.roleModel.Remarks, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.roleModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Role form data
  get form(): any {
    return this.roleForm.controls;
  }
}
