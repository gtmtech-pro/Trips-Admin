import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant'
import { AccountTransactionService } from '../account-transaction.service';
import { AccountTransactionModel } from '../account-transaction.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'account-transaction',
  templateUrl: './create-account-transaction.component.html',
  styleUrls: ['./create-account-transaction.component.scss'],
  standalone: false
})
export class CreateAccountTransactionComponent extends BaseComponent<AccountTransactionModel> implements OnInit {
  accountTransactionForm!: FormGroup;
  accountTransactionModel!: AccountTransactionModel;
  accountList!: DropdownModel[];
  transactionList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private accountTransactionService: AccountTransactionService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Account Transaction', active: true }];

    // Set the default accountTransaction Model
    this.accountTransactionModel = new AccountTransactionModel();
    this.accountTransactionForm = this.createAccountTransactionForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.accountTransactionService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.accountList = results[0].Results;
      }

      if (results[1].Success) {
        this.transactionList = results[1].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.accountTransactionModel = new AccountTransactionModel();
            this.showHideLoading(false);

          } else {
            let accountTransactionId: string = params.get('accountTransactionId')!

            this.accountTransactionService.getAccountTransactionById(accountTransactionId)
              .subscribe((response: any) => {
                this.accountTransactionModel = new AccountTransactionModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.accountTransactionModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.accountTransactionModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.accountTransactionForm = this.createAccountTransactionForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateAccountTransactionDetails() {
    if (!this.accountTransactionForm.valid) {
      this.validateAllFormFields(this.accountTransactionForm);
      return;
    }

    this.setValueFromFormGroup(this.accountTransactionForm, this.accountTransactionModel);

    this.showHideLoading(true);
    this.accountTransactionService.createOrUpdateAccountTransaction(this.accountTransactionModel)
      .subscribe((accountTransactionResp: any) => {

        if (accountTransactionResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.AccountTransaction.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(accountTransactionResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('AccountTransaction deletion errors =>', error);
      });
  }

  //Create accountTransaction form and returns {FormGroup}
  createAccountTransactionForm(): FormGroup {
    return this.formBuilder.group({
      AccountTransactionId: new FormControl(this.accountTransactionModel.AccountTransactionId),
      AccountId: new FormControl({ value: this.accountTransactionModel.AccountId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TransactionId: new FormControl({ value: this.accountTransactionModel.TransactionId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Rights: new FormControl({ value: this.accountTransactionModel.Rights, disabled: this.PageRights.IsReadOnly }),
      CanAdd: new FormControl({ value: this.accountTransactionModel.CanAdd, disabled: this.PageRights.IsReadOnly }),
      CanEdit: new FormControl({ value: this.accountTransactionModel.CanEdit, disabled: this.PageRights.IsReadOnly }),
      CanDelete: new FormControl({ value: this.accountTransactionModel.CanDelete, disabled: this.PageRights.IsReadOnly }),
      CanView: new FormControl({ value: this.accountTransactionModel.CanView, disabled: this.PageRights.IsReadOnly }),
      CanExport: new FormControl({ value: this.accountTransactionModel.CanExport, disabled: this.PageRights.IsReadOnly }),
      CanChild: new FormControl({ value: this.accountTransactionModel.CanChild, disabled: this.PageRights.IsReadOnly }),
      CanRemark: new FormControl({ value: this.accountTransactionModel.CanRemark, disabled: this.PageRights.IsReadOnly }),
      ListView: new FormControl({ value: this.accountTransactionModel.ListView, disabled: this.PageRights.IsReadOnly }),
      BasicView: new FormControl({ value: this.accountTransactionModel.BasicView, disabled: this.PageRights.IsReadOnly }),
      DetailView: new FormControl({ value: this.accountTransactionModel.DetailView, disabled: this.PageRights.IsReadOnly }),
      IsPublic: new FormControl({ value: this.accountTransactionModel.IsPublic, disabled: this.PageRights.IsReadOnly }),
      Remarks: new FormControl({ value: this.accountTransactionModel.Remarks, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.accountTransactionModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns AccountTransaction form data
  get form(): any {
    return this.accountTransactionForm.controls;
  }
}
