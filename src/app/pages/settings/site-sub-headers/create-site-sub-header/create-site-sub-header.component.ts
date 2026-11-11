import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant'
import { SiteSubHeaderService } from '../site-sub-header.service';
import { SiteSubHeaderModel } from '../site-sub-header.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'site-sub-header',
  templateUrl: './create-site-sub-header.component.html',
  styleUrls: ['./create-site-sub-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CreateSiteSubHeaderComponent extends BaseComponent<SiteSubHeaderModel> implements OnInit {
  siteSubHeaderForm!: FormGroup;
  siteSubHeaderModel!: SiteSubHeaderModel;
  siteHeaderList!: DropdownModel[];
  transactionList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private siteSubHeaderService: SiteSubHeaderService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Site Sub Header', active: true }];

    // Set the default siteSubHeader Model
    this.siteSubHeaderModel = new SiteSubHeaderModel();
    this.siteSubHeaderForm = this.createSiteSubHeaderForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.siteSubHeaderService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.siteHeaderList = results[0].Results;
      }

      if (results[1].Success) {
        this.transactionList = results[1].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.siteSubHeaderModel = new SiteSubHeaderModel();
            this.showHideLoading(false);

          } else {
            let siteSubHeaderId: string = params.get('siteSubHeaderId')!

            this.siteSubHeaderService.getSiteSubHeaderById(siteSubHeaderId)
              .subscribe((response: any) => {
                this.siteSubHeaderModel = new SiteSubHeaderModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.siteSubHeaderModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.siteSubHeaderModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.siteSubHeaderForm = this.createSiteSubHeaderForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateSiteSubHeaderDetails() {
    if (!this.siteSubHeaderForm.valid) {
      this.validateAllFormFields(this.siteSubHeaderForm);
      return;
    }

    this.setValueFromFormGroup(this.siteSubHeaderForm, this.siteSubHeaderModel);

    this.showHideLoading(true);
    this.siteSubHeaderService.createOrUpdateSiteSubHeader(this.siteSubHeaderModel)
      .subscribe((siteSubHeaderResp: any) => {

        if (siteSubHeaderResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.SiteSubHeader.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(siteSubHeaderResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('SiteSubHeader deletion errors =>', error);
      });
  }

  //Create siteSubHeader form and returns {FormGroup}
  createSiteSubHeaderForm(): FormGroup {
    return this.formBuilder.group({
      SiteSubHeaderId: new FormControl(this.siteSubHeaderModel.SiteSubHeaderId),
      SiteHeaderId: new FormControl({ value: this.siteSubHeaderModel.SiteHeaderId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ParentHeaderId: new FormControl({ value: this.siteSubHeaderModel.ParentHeaderId, disabled: this.PageRights.IsReadOnly }),
      TransactionId: new FormControl({ value: this.siteSubHeaderModel.TransactionId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      DisplayOrder: new FormControl({ value: this.siteSubHeaderModel.DisplayOrder, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Remarks: new FormControl({ value: this.siteSubHeaderModel.Remarks, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.siteSubHeaderModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns SiteSubHeader form data
  get form(): any {
    return this.siteSubHeaderForm.controls;
  }
}
