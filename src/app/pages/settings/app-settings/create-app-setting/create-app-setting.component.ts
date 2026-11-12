import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RouteConstants } from '../../../../constants/route.constant'
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { AppSettingService } from '../app-setting.service';
import { AppSettingModel } from '../app-setting.model';

@Component({
  selector: 'app-setting',
  templateUrl: './create-app-setting.component.html',
  styleUrls: ['./create-app-setting.component.scss'],
  standalone: false
})
export class CreateAppSettingComponent extends BaseComponent<AppSettingModel> implements OnInit {
  appSettingForm!: FormGroup;
  appSettingModel!: AppSettingModel;

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private appSettingService: AppSettingService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Masters' }, { label: 'App Setting', active: true }];

    // Set the default appSetting Model
    this.appSettingModel = new AppSettingModel();
    this.appSettingForm = this.createAppSettingForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.PageRights.ActionType = params.get('actionType')!;

        if (this.PageRights.ActionType == this.Constants.Actions.New) {
          this.appSettingModel = new AppSettingModel();
          this.showHideLoading(false);

        } else {
          let settingId: string = params.get('settingId')!

          this.appSettingService.getAppSettingById(settingId)
            .subscribe((response: any) => {
              this.appSettingModel = response.Result;

              if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                this.appSettingModel.RequestType = this.Constants.PageType.Edit;
              else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                this.appSettingModel.RequestType = this.Constants.PageType.View;
                this.PageRights.IsReadOnly = true;
              }

              this.appSettingForm = this.createAppSettingForm();
              this.showHideLoading(false);
            });
        }
      }
    });
  }

  saveOrUpdateAppSettingDetails() {
    if (!this.appSettingForm.valid) {
      this.validateAllFormFields(this.appSettingForm);
      return;
    }

    this.setValueFromFormGroup(this.appSettingForm, this.appSettingModel);

    this.showHideLoading(true);
    this.appSettingService.createOrUpdateAppSetting(this.appSettingModel)
      .subscribe((appSettingResp: any) => {

        if (appSettingResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.AppSetting.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(appSettingResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('AppSetting deletion errors =>', error);
      });
  }

  //Create appSetting form and returns {FormGroup}
  createAppSettingForm(): FormGroup {
    return this.formBuilder.group({
      SettingId: new FormControl(this.appSettingModel.SettingId),
      SettingType: new FormControl({ value: this.appSettingModel.SettingType, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      SettingName: new FormControl({ value: this.appSettingModel.SettingName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(100)]),
      SettingLabel: new FormControl({ value: this.appSettingModel.SettingLabel, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(150)]),
      SettingValue: new FormControl({ value: this.appSettingModel.SettingValue, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(500)]),
      FormattedValue: new FormControl({ value: this.appSettingModel.FormattedValue, disabled: this.PageRights.IsReadOnly }),
      DisplayOrder: new FormControl({ value: this.appSettingModel.DisplayOrder, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Remarks: new FormControl({ value: this.appSettingModel.Remarks, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.appSettingModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns AppSetting form data
  get form(): any {
    return this.appSettingForm.controls;
  }
}
