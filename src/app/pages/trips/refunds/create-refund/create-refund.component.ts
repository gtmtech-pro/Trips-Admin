import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { RefundService } from '../refund.service';
import { RefundModel } from '../refund.model';

@Component({
  selector: 'refund',
  templateUrl: './create-refund.component.html',
  styleUrls: ['./create-refund.component.scss'],
  standalone: false
})
export class CreateRefundComponent extends BaseComponent<RefundModel> implements OnInit {
  refundForm!: FormGroup;
  refundModel!: RefundModel;
  originalExpenseList!: any[];
  receivedByTripMemberList!: any[];
  tripList!: any[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private refundService: RefundService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Refund', active: true }];

    // Set the default refund Model
    this.refundModel = new RefundModel();
    this.refundForm = this.createRefundForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.PageRights.ActionType = params.get('actionType')!;

        if (this.PageRights.ActionType == this.Constants.Actions.New) {
          this.refundModel = new RefundModel();
          this.showHideLoading(false);

        } else {
          let refundId: string = params.get('refundId')!

          this.refundService.getRefundById(refundId)
            .subscribe((response: any) => {
              this.refundModel = response.Result;

              if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                this.refundModel.RequestType = this.Constants.PageType.Edit;
              else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                this.refundModel.RequestType = this.Constants.PageType.View;
                this.PageRights.IsReadOnly = true;
              }

              this.refundForm = this.createRefundForm();
              this.showHideLoading(false);
            });
        }
      }
    });
  }

  saveOrUpdateRefundDetails() {
    if (!this.refundForm.valid) {
      this.validateAllFormFields(this.refundForm);
      return;
    }

    this.setValueFromFormGroup(this.refundForm, this.refundModel);

    this.showHideLoading(true);
    this.refundService.createOrUpdateRefund(this.refundModel)
      .subscribe((refundResp: any) => {

        if (refundResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Refund.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(refundResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Refund deletion errors =>', error);
      });
  }

  //Create refund form and returns {FormGroup}
  createRefundForm(): FormGroup {
    return this.formBuilder.group({
      RefundId: new FormControl(this.refundModel.RefundId),
      TripId: new FormControl({ value: this.refundModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      OriginalExpenseId: new FormControl({ value: this.refundModel.OriginalExpenseId, disabled: this.PageRights.IsReadOnly }),
      ReceivedByTripMemberId: new FormControl({ value: this.refundModel.ReceivedByTripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Amount: new FormControl({ value: this.refundModel.Amount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      BaseAmount: new FormControl({ value: this.refundModel.BaseAmount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      RefundDate: new FormControl({ value: this.getDateForAPIFromText(this.refundModel.RefundDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Notes: new FormControl({ value: this.refundModel.Notes, disabled: this.PageRights.IsReadOnly }),
      RefundStatus: new FormControl({ value: this.refundModel.RefundStatus, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.refundModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Refund form data
  get form(): any {
    return this.refundForm.controls;
  }
}
