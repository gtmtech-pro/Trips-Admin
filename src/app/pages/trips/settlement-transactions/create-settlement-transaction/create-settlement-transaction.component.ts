import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { SettlementTransactionService } from '../settlement-transaction.service';
import { SettlementTransactionModel } from '../settlement-transaction.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'settlement-transaction',
  templateUrl: './create-settlement-transaction.component.html',
  styleUrls: ['./create-settlement-transaction.component.scss'],
  standalone: false
})
export class CreateSettlementTransactionComponent extends BaseComponent<SettlementTransactionModel> implements OnInit {
  settlementTransactionForm!: FormGroup;
  settlementTransactionModel!: SettlementTransactionModel;
  settlementList!: DropdownModel[];
  tripMemberList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private settlementTransactionService: SettlementTransactionService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Settlement Transaction', active: true }];

    // Set the default settlementTransaction Model
    this.settlementTransactionModel = new SettlementTransactionModel();
    this.settlementTransactionForm = this.createSettlementTransactionForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.settlementTransactionService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.settlementList = results[0].Results;
      }

      if (results[1].Success) {
        this.tripMemberList = results[1].Results;
      }

      if (results[2].Success) {
        this.tripMemberList = results[2].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.settlementTransactionModel = new SettlementTransactionModel();
            this.showHideLoading(false);

          } else {
            let settlementTransactionId: string = params.get('settlementTransactionId')!

            this.settlementTransactionService.getSettlementTransactionById(settlementTransactionId)
              .subscribe((response: any) => {
                this.settlementTransactionModel = new SettlementTransactionModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.settlementTransactionModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.settlementTransactionModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.settlementTransactionForm = this.createSettlementTransactionForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateSettlementTransactionDetails() {
    if (!this.settlementTransactionForm.valid) {
      this.validateAllFormFields(this.settlementTransactionForm);
      return;
    }

    this.setValueFromFormGroup(this.settlementTransactionForm, this.settlementTransactionModel);

    this.showHideLoading(true);
    this.settlementTransactionService.createOrUpdateSettlementTransaction(this.settlementTransactionModel)
      .subscribe((settlementTransactionResp: any) => {

        if (settlementTransactionResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.SettlementTransaction.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(settlementTransactionResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('SettlementTransaction deletion errors =>', error);
      });
  }

  //Create settlementTransaction form and returns {FormGroup}
  createSettlementTransactionForm(): FormGroup {
    return this.formBuilder.group({
      SettlementTransactionId: new FormControl(this.settlementTransactionModel.SettlementTransactionId),
      SettlementId: new FormControl({ value: this.settlementTransactionModel.SettlementId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      FromTripMemberId: new FormControl({ value: this.settlementTransactionModel.FromTripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ToTripMemberId: new FormControl({ value: this.settlementTransactionModel.ToTripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Amount: new FormControl({ value: this.settlementTransactionModel.Amount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TransactionStatus: new FormControl({ value: this.settlementTransactionModel.TransactionStatus, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(30)]),
      PaidAtUtc: new FormControl({ value: this.getDateForAPIFromText(this.settlementTransactionModel.PaidAtUtc), disabled: this.PageRights.IsReadOnly }),
      PaymentMode: new FormControl({ value: this.settlementTransactionModel.PaymentMode, disabled: this.PageRights.IsReadOnly }),
      TransactionReference: new FormControl({ value: this.settlementTransactionModel.TransactionReference, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.settlementTransactionModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns SettlementTransaction form data
  get form(): any {
    return this.settlementTransactionForm.controls;
  }
}
