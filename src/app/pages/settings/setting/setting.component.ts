import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ShowDialogService } from '../../../shared/show-dialog.service';
import { BaseComponent } from '../../../common/base/base.component';
import { CommonService } from '../../../services/common.service';
import { SettingService } from './setting.service';
import { SettingModel } from './setting.model';
import { DropdownModel } from '../../../models/dropdown.model';

@Component({
  selector: 'data-list-view',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  encapsulation: ViewEncapsulation.None,
  //animations: fuseAnimations
})
export class SettingComponent extends BaseComponent<SettingModel> implements OnInit {
  settingForm: FormGroup;
  fileCompressForm: FormGroup;
  syncServiceForm: FormGroup;

  settingModel: SettingModel;
  roleList: DropdownModel[] = [];
  filteredRoleItems: any;
  userList: DropdownModel[] = [];
  filteredUserItems: any;

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private settingService: SettingService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    // Set the default setting Model
    this.settingModel = new SettingModel();
    this.settingForm = this.createSettingForm();
    this.fileCompressForm = this.createFileCompressForm();
    this.syncServiceForm = this.createSyncServiceForm();
  }

  override ngOnInit(): void {
    this.settingService.getAllRoles().subscribe((result) => {

      if (result.Success) {
        if (this.UserModel.RoleId == 'SUR') {
          this.roleList = result.Results;
        }
        else {
          this.roleList = result.Results.filter((r: any) => r.Id != this.Constants.SuperUser);
        }
        this.filteredRoleItems = this.roleList.slice();

        this.route.paramMap.subscribe(params => {
          this.settingForm = this.createSettingForm();
        });
      }
    });
  }

  onChangeRole(roleId: any) {
    this.commonService.GetMasterDataByType({ DataType: 'AccountsByRole', UserId: this.UserModel.UserId, ParentId: roleId, SelectTitle: 'Account' }, false).subscribe((response: any) => {
      this.userList = response.Results;
      this.filteredUserItems = this.userList.slice();
    });
  }

  saveSettings() {
    if (!this.settingForm.valid) {
      this.validateAllFormFields(this.settingForm);
      return;
    }

    this.setValueFromFormGroup(this.settingForm, this.settingModel);

    this.settingService.saveSettings(this.settingModel)
      .subscribe((settingResp: any) => {

        if (settingResp.Success) {
          this.dialogService.openShowDialog('<b>User details</b><p>Login Id : ' + settingResp.Result.LoginId + ' <br />Password : ' + settingResp.Result.Password + '</p>');
        }
        else {
          var errorMessages = this.getHtmlMessage(settingResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
      }, (error: any) => {
        console.log('Setting deletion errors =>', error);
      });
  }

  compressFiles() {
    if (!this.fileCompressForm.valid) {
      this.validateAllFormFields(this.fileCompressForm);
      return;
    }

    this.setValueFromFormGroup(this.fileCompressForm, this.settingModel);

    let compressParams = {
      DataId: this.settingModel.ContentTypeId,
      DataId1: this.settingModel.LargestFilesSize,
      DataId2: this.settingModel.FilesForCompress,
      DataId3: this.settingModel.IsWatermarkAllowed,
    };

    this.settingService.compressFiles(compressParams)
      .subscribe((settingResp: any) => {
        if (settingResp.Success) {
          this.dialogService.openShowDialog('Compress process completed');
        }
        else {
          var errorMessages = this.getHtmlMessage(settingResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }

        console.log(settingResp);
      }, (error: any) => {
        console.log('Setting deletion errors =>', error);
      });
  }

  syncService() {
    if (!this.syncServiceForm.valid) {
      this.validateAllFormFields(this.syncServiceForm);
      return;
    }

    let serviceName = this.syncServiceForm.controls['SyncServiceName'].value;
    let syncServiceUrl = 'SyncService/' + serviceName;
    let syncParams = {
      SyncDateTime: this.syncServiceForm.controls['SyncDateTime'].value
    };

    this.settingService.syncLighthouseService(syncServiceUrl, syncParams).subscribe((syncResp: any) => {
      if (syncResp.Success) {
        this.dialogService.openShowDialog(serviceName + ' : Total records is ' + syncResp.Results.length);
      }
      else {
        var errorMessages = this.getHtmlMessage(syncResp.Errors)
        this.dialogService.openShowDialog(errorMessages);
      }
    }, error => {
      console.log('SyncService deletion errors =>', error);
    });
  }

  //Create Setting form and returns {FormGroup}
  createSettingForm(): FormGroup {
    return this.formBuilder.group({
      RoleId: new FormControl('', Validators.required),
      UserId: new FormControl('', Validators.required),
    });
  }

  //Create File Compress form and returns {FormGroup}
  createFileCompressForm(): FormGroup {
    return this.formBuilder.group({
      ContentTypeId: new FormControl('', Validators.required),
      LargestFilesSize: new FormControl('', Validators.required),
      FilesForCompress: new FormControl('', Validators.required),
      IsWatermarkAllowed: new FormControl(false, Validators.required),
    });
  }

  //Create SyncService form and returns {FormGroup}
  createSyncServiceForm(): FormGroup {
    return this.formBuilder.group({
      SyncServiceName: new FormControl('', Validators.required),
      SyncDateTime: new FormControl('', [Validators.required])
    });
  }

}
