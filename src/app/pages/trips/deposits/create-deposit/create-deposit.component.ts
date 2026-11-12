import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { DepositService } from '../deposit.service';
import { DepositModel } from '../deposit.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'deposit',
  templateUrl: './create-deposit.component.html',
  styleUrls: ['./create-deposit.component.scss'],
  standalone: false
})
export class CreateDepositComponent extends BaseComponent<DepositModel> implements OnInit {
  depositForm!: FormGroup;
  depositModel!: DepositModel;
  tripMemberList!: DropdownModel[];
  tripList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private depositService: DepositService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Deposit', active: true }];

    // Set the default deposit Model
    this.depositModel = new DepositModel();
    this.depositForm = this.createDepositForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.depositService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.tripMemberList = results[0].Results;
      }

      if (results[1].Success) {
        this.tripList = results[1].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.depositModel = new DepositModel();
            this.showHideLoading(false);

          } else {
            let depositId: string = params.get('depositId')!

            this.depositService.getDepositById(depositId)
              .subscribe((response: any) => {
                this.depositModel = new DepositModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.depositModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.depositModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.depositForm = this.createDepositForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateDepositDetails() {
    if (!this.depositForm.valid) {
      this.validateAllFormFields(this.depositForm);
      return;
    }

    this.setValueFromFormGroup(this.depositForm, this.depositModel);

    this.showHideLoading(true);
    this.depositService.createOrUpdateDeposit(this.depositModel)
      .subscribe((depositResp: any) => {

        if (depositResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Deposit.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(depositResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Deposit deletion errors =>', error);
      });
  }

  //Create deposit form and returns {FormGroup}
  createDepositForm(): FormGroup {
    return this.formBuilder.group({
      DepositId: new FormControl(this.depositModel.DepositId),
      TripId: new FormControl({ value: this.depositModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TripMemberId: new FormControl({ value: this.depositModel.TripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Amount: new FormControl({ value: this.depositModel.Amount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      BaseAmount: new FormControl({ value: this.depositModel.BaseAmount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      DepositDate: new FormControl({ value: this.getDateForAPIFromText(this.depositModel.DepositDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      PaymentMethod: new FormControl({ value: this.depositModel.PaymentMethod, disabled: this.PageRights.IsReadOnly }),
      TransactionReference: new FormControl({ value: this.depositModel.TransactionReference, disabled: this.PageRights.IsReadOnly }),
      Status: new FormControl({ value: this.depositModel.Status, disabled: this.PageRights.IsReadOnly }),
      Notes: new FormControl({ value: this.depositModel.Notes, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.depositModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Deposit form data
  get form(): any {
    return this.depositForm.controls;
  }
}
