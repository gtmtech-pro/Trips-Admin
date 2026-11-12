import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { SettlementService } from '../settlement.service';
import { SettlementModel } from '../settlement.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'settlement',
  templateUrl: './create-settlement.component.html',
  styleUrls: ['./create-settlement.component.scss'],
  standalone: false
})
export class CreateSettlementComponent extends BaseComponent<SettlementModel> implements OnInit {
  settlementForm!: FormGroup;
  settlementModel!: SettlementModel;
  tripMemberList!: DropdownModel[];
  tripList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private settlementService: SettlementService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Settlement', active: true }];

    // Set the default settlement Model
    this.settlementModel = new SettlementModel();
    this.settlementForm = this.createSettlementForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.settlementService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.tripMemberList = results[0].Results;
      }

      if (results[1].Success) {
        this.tripList = results[2].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.settlementModel = new SettlementModel();
            this.showHideLoading(false);

          } else {
            let settlementId: string = params.get('settlementId')!

            this.settlementService.getSettlementById(settlementId)
              .subscribe((response: any) => {
                this.settlementModel = new SettlementModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.settlementModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.settlementModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.settlementForm = this.createSettlementForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateSettlementDetails() {
    if (!this.settlementForm.valid) {
      this.validateAllFormFields(this.settlementForm);
      return;
    }

    this.setValueFromFormGroup(this.settlementForm, this.settlementModel);

    this.showHideLoading(true);
    this.settlementService.createOrUpdateSettlement(this.settlementModel)
      .subscribe((settlementResp: any) => {

        if (settlementResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Settlement.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(settlementResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Settlement deletion errors =>', error);
      });
  }

  //Create settlement form and returns {FormGroup}
  createSettlementForm(): FormGroup {
    return this.formBuilder.group({
      SettlementId: new FormControl(this.settlementModel.SettlementId),
      TripId: new FormControl({ value: this.settlementModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      FromTripMemberId: new FormControl({ value: this.settlementModel.FromTripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ToTripMemberId: new FormControl({ value: this.settlementModel.ToTripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Amount: new FormControl({ value: this.settlementModel.Amount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      PaymentMethod: new FormControl({ value: this.settlementModel.PaymentMethod, disabled: this.PageRights.IsReadOnly }),
      SettlementDate: new FormControl({ value: this.getDateForAPIFromText(this.settlementModel.SettlementDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ConfirmedDate: new FormControl({ value: this.getDateForAPIFromText(this.settlementModel.ConfirmedDate), disabled: this.PageRights.IsReadOnly }),
      CompletedDate: new FormControl({ value: this.getDateForAPIFromText(this.settlementModel.CompletedDate), disabled: this.PageRights.IsReadOnly }),
      SettlementStatus: new FormControl({ value: this.settlementModel.SettlementStatus, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(20)]),
      ReferenceNo: new FormControl({ value: this.settlementModel.ReferenceNo, disabled: this.PageRights.IsReadOnly }),
      Notes: new FormControl({ value: this.settlementModel.Notes, disabled: this.PageRights.IsReadOnly }),
      Status: new FormControl({ value: this.settlementModel.Status, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.settlementModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Settlement form data
  get form(): any {
    return this.settlementForm.controls;
  }
}
