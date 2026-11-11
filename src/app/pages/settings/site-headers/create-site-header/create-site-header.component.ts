import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant'
import { SiteHeaderService } from '../site-header.service';
import { SiteHeaderModel } from '../site-header.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'site-header',
  templateUrl: './create-site-header.component.html',
  styleUrls: ['./create-site-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CreateSiteHeaderComponent extends BaseComponent<SiteHeaderModel> implements OnInit {
  siteHeaderForm!: FormGroup;
  siteHeaderModel!: SiteHeaderModel;
  siteHeaderList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private siteHeaderService: SiteHeaderService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Site Header', active: true }];

    // Set the default siteHeader Model
    this.siteHeaderModel = new SiteHeaderModel();
    this.siteHeaderForm = this.createSiteHeaderForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.siteHeaderService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.siteHeaderList = results[0].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.siteHeaderModel = new SiteHeaderModel();
            this.showHideLoading(false);

          } else {
            let siteHeaderId: string = params.get('siteHeaderId')!

            this.siteHeaderService.getSiteHeaderById(siteHeaderId)
              .subscribe((response: any) => {
                this.siteHeaderModel = new SiteHeaderModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.siteHeaderModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.siteHeaderModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.siteHeaderForm = this.createSiteHeaderForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateSiteHeaderDetails() {
    if (!this.siteHeaderForm.valid) {
      this.validateAllFormFields(this.siteHeaderForm);
      return;
    }

    this.setValueFromFormGroup(this.siteHeaderForm, this.siteHeaderModel);

    this.showHideLoading(true);
    this.siteHeaderService.createOrUpdateSiteHeader(this.siteHeaderModel)
      .subscribe((siteHeaderResp: any) => {

        if (siteHeaderResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.SiteHeader.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(siteHeaderResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('SiteHeader deletion errors =>', error);
      });
  }

  //Create siteHeader form and returns {FormGroup}
  createSiteHeaderForm(): FormGroup {
    return this.formBuilder.group({
      SiteHeaderId: new FormControl(this.siteHeaderModel.SiteHeaderId),
      ParentHeaderId: new FormControl({ value: this.siteHeaderModel.ParentHeaderId, disabled: this.PageRights.IsReadOnly }),
      ShortName: new FormControl({ value: this.siteHeaderModel.ShortName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(40)]),
      LongName: new FormControl({ value: this.siteHeaderModel.LongName, disabled: this.PageRights.IsReadOnly }),
      Description: new FormControl({ value: this.siteHeaderModel.Description, disabled: this.PageRights.IsReadOnly }),
      DisplayOrder: new FormControl({ value: this.siteHeaderModel.DisplayOrder, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      IconUrl: new FormControl({ value: this.siteHeaderModel.IconUrl, disabled: this.PageRights.IsReadOnly }),
      Remarks: new FormControl({ value: this.siteHeaderModel.Remarks, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.siteHeaderModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns SiteHeader form data
  get form(): any {
    return this.siteHeaderForm.controls;
  }
}
