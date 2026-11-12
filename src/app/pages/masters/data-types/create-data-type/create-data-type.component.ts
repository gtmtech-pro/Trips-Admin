import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RouteConstants } from '../../../../constants/route.constant'
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { DataTypeService } from '../data-type.service';
import { DataTypeModel } from '../data-type.model';

@Component({
  selector: 'data-type',
  templateUrl: './create-data-type.component.html',
  styleUrls: ['./create-data-type.component.scss'],
  standalone: false
})
export class CreateDataTypeComponent extends BaseComponent<DataTypeModel> implements OnInit {
  dataTypeForm!: FormGroup;
  dataTypeModel!: DataTypeModel;

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private dataTypeService: DataTypeService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Masters' }, { label: 'Data Type', active: true }];

    // Set the default dataType Model
    this.dataTypeModel = new DataTypeModel();
    this.dataTypeForm = this.createDataTypeForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.PageRights.ActionType = params.get('actionType')!;

        if (this.PageRights.ActionType == this.Constants.Actions.New) {
          this.dataTypeModel = new DataTypeModel();
          this.showHideLoading(false);

        } else {
          let dataTypeId: string = params.get('dataTypeId')!

          this.dataTypeService.getDataTypeById(dataTypeId)
            .subscribe((response: any) => {
              this.dataTypeModel = response.Result;

              if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                this.dataTypeModel.RequestType = this.Constants.PageType.Edit;
              else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                this.dataTypeModel.RequestType = this.Constants.PageType.View;
                this.PageRights.IsReadOnly = true;
              }

              this.dataTypeForm = this.createDataTypeForm();
              this.showHideLoading(false);
            });
        }
      }
    });
  }

  saveOrUpdateDataTypeDetails() {
    if (!this.dataTypeForm.valid) {
      this.validateAllFormFields(this.dataTypeForm);
      return;
    }

    this.setValueFromFormGroup(this.dataTypeForm, this.dataTypeModel);

    this.showHideLoading(true);
    this.dataTypeService.createOrUpdateDataType(this.dataTypeModel)
      .subscribe((dataTypeResp: any) => {

        if (dataTypeResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.DataType.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(dataTypeResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('DataType deletion errors =>', error);
      });
  }

  //Create dataType form and returns {FormGroup}
  createDataTypeForm(): FormGroup {
    return this.formBuilder.group({
      DataTypeId: new FormControl(this.dataTypeModel.DataTypeId),
      Name: new FormControl({ value: this.dataTypeModel.Name, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      Description: new FormControl({ value: this.dataTypeModel.Description, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(350)]),
      IsActive: new FormControl({ value: this.dataTypeModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns DataType form data
  get form(): any {
    return this.dataTypeForm.controls;
  }
}
