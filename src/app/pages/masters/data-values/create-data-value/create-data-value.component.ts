import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RouteConstants } from '../../../../constants/route.constant'
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { DataValueService } from '../data-value.service';
import { DataValueModel } from '../data-value.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'data-value',
  templateUrl: './create-data-value.component.html',
  styleUrls: ['./create-data-value.component.scss'],
  standalone: false
})
export class CreateDataValueComponent extends BaseComponent<DataValueModel> implements OnInit {
  dataValueForm!: FormGroup;
  dataValueModel!: DataValueModel;
  dataTypeList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private dataValueService: DataValueService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Masters' }, { label: 'Data Value', active: true }];

    // Set the default dataValue Model
    this.dataValueModel = new DataValueModel();
    this.dataValueForm = this.createDataValueForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.dataValueService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.dataTypeList = results[0].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.dataValueModel = new DataValueModel();
            this.showHideLoading(false);

          } else {
            let dataValueId: string = params.get('dataValueId')!

            this.dataValueService.getDataValueById(dataValueId)
              .subscribe((response: any) => {
                this.dataValueModel = new DataValueModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.dataValueModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.dataValueModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.dataValueForm = this.createDataValueForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateDataValueDetails() {
    if (!this.dataValueForm.valid) {
      this.validateAllFormFields(this.dataValueForm);
      return;
    }

    this.setValueFromFormGroup(this.dataValueForm, this.dataValueModel);

    this.showHideLoading(true);
    this.dataValueService.createOrUpdateDataValue(this.dataValueModel)
      .subscribe((dataValueResp: any) => {

        if (dataValueResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.DataValue.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(dataValueResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('DataValue deletion errors =>', error);
      });
  }

  //Create dataValue form and returns {FormGroup}
  createDataValueForm(): FormGroup {
    return this.formBuilder.group({
      DataValueId: new FormControl(this.dataValueModel.DataValueId),
      DataTypeId: new FormControl(this.dataValueModel.DataTypeId),
      ParentId: new FormControl({ value: this.dataValueModel.ParentId, disabled: this.PageRights.IsReadOnly }),
      Code: new FormControl({ value: this.dataValueModel.Code, disabled: this.PageRights.IsReadOnly }),
      Name: new FormControl({ value: this.dataValueModel.Name, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(200)]),
      Description: new FormControl({ value: this.dataValueModel.Description, disabled: this.PageRights.IsReadOnly }),
      DisplayOrder: new FormControl({ value: this.dataValueModel.DisplayOrder, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      FilterValue1: new FormControl({ value: this.dataValueModel.FilterValue1, disabled: this.PageRights.IsReadOnly }),
      FilterValue2: new FormControl({ value: this.dataValueModel.FilterValue2, disabled: this.PageRights.IsReadOnly }),
      FilterValue3: new FormControl({ value: this.dataValueModel.FilterValue3, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.dataValueModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns DataValue form data
  get form(): any {
    return this.dataValueForm.controls;
  }
}
