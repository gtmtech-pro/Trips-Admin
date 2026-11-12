import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { TransactionService } from '../transaction.service';
import { TransactionModel } from '../transaction.model';

@Component({
  selector: 'transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class CreateTransactionComponent extends BaseComponent<TransactionModel> implements OnInit {
  transactionForm!: FormGroup;
  transactionModel!: TransactionModel;

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private transactionService: TransactionService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Transaction', active: true }];

    // Set the default transaction Model
    this.transactionModel = new TransactionModel();
    this.transactionForm = this.createTransactionForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.PageRights.ActionType = params.get('actionType')!;

        if (this.PageRights.ActionType == this.Constants.Actions.New) {
          this.transactionModel = new TransactionModel();
          this.showHideLoading(false);

        } else {
          let transactionId: string = params.get('transactionId')!

          this.transactionService.getTransactionById(transactionId)
            .subscribe((response: any) => {
              this.transactionModel = response.Result;

              if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                this.transactionModel.RequestType = this.Constants.PageType.Edit;
              else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                this.transactionModel.RequestType = this.Constants.PageType.View;
                this.PageRights.IsReadOnly = true;
              }

              this.transactionForm = this.createTransactionForm();
              this.showHideLoading(false);
            });
        }
      }
    });
  }

  saveOrUpdateTransactionDetails() {
    if (!this.transactionForm.valid) {
      this.validateAllFormFields(this.transactionForm);
      return;
    }

    this.setValueFromFormGroup(this.transactionForm, this.transactionModel);

    this.showHideLoading(true);
    this.transactionService.createOrUpdateTransaction(this.transactionModel)
      .subscribe((transactionResp: any) => {

        if (transactionResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Transaction.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(transactionResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Transaction deletion errors =>', error);
      });
  }

  //Create transaction form and returns {FormGroup}
  createTransactionForm(): FormGroup {
    return this.formBuilder.group({
      TransactionId: new FormControl(this.transactionModel.TransactionId),
      Code: new FormControl({ value: this.transactionModel.Code, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
      Name: new FormControl({ value: this.transactionModel.Name, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(70)]),
      PageTitle: new FormControl({ value: this.transactionModel.PageTitle, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(200)]),
      PageDescription: new FormControl({ value: this.transactionModel.PageDescription, disabled: this.PageRights.IsReadOnly }),
      UrlAction: new FormControl({ value: this.transactionModel.UrlAction, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(100)]),
      UrlController: new FormControl({ value: this.transactionModel.UrlController, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      UrlPara: new FormControl({ value: this.transactionModel.UrlPara, disabled: this.PageRights.IsReadOnly }),
      RouteUrl: new FormControl({ value: this.transactionModel.RouteUrl, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(150)]),
      DisplayOrder: new FormControl({ value: this.transactionModel.DisplayOrder, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      IconUrl: new FormControl({ value: this.transactionModel.IconUrl, disabled: this.PageRights.IsReadOnly }),
      Remarks: new FormControl({ value: this.transactionModel.Remarks, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.transactionModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Transaction form data
  get form(): any {
    return this.transactionForm.controls;
  }
}
