import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { ExpenseShareService } from '../expense-share.service';
import { ExpenseShareModel } from '../expense-share.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'expense-share',
  templateUrl: './create-expense-share.component.html',
  styleUrls: ['./create-expense-share.component.scss'],
  standalone: false
})
export class CreateExpenseShareComponent extends BaseComponent<ExpenseShareModel> implements OnInit {
  expenseShareForm!: FormGroup;
  expenseShareModel!: ExpenseShareModel;
  expenseList!: DropdownModel[];
  tripMemberList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private expenseShareService: ExpenseShareService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Expense Share', active: true }];

    // Set the default expenseShare Model
    this.expenseShareModel = new ExpenseShareModel();
    this.expenseShareForm = this.createExpenseShareForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.expenseShareService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.expenseList = results[0].Results;
      }

      if (results[1].Success) {
        this.tripMemberList = results[1].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.expenseShareModel = new ExpenseShareModel();
            this.showHideLoading(false);

          } else {
            let expenseShareId: string = params.get('expenseShareId')!

            this.expenseShareService.getExpenseShareById(expenseShareId)
              .subscribe((response: any) => {
                this.expenseShareModel = new ExpenseShareModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.expenseShareModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.expenseShareModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.expenseShareForm = this.createExpenseShareForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateExpenseShareDetails() {
    if (!this.expenseShareForm.valid) {
      this.validateAllFormFields(this.expenseShareForm);
      return;
    }

    this.setValueFromFormGroup(this.expenseShareForm, this.expenseShareModel);

    this.showHideLoading(true);
    this.expenseShareService.createOrUpdateExpenseShare(this.expenseShareModel)
      .subscribe((expenseShareResp: any) => {

        if (expenseShareResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.ExpenseShare.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(expenseShareResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('ExpenseShare deletion errors =>', error);
      });
  }

  //Create expenseShare form and returns {FormGroup}
  createExpenseShareForm(): FormGroup {
    return this.formBuilder.group({
      ExpenseShareId: new FormControl(this.expenseShareModel.ExpenseShareId),
      ExpenseId: new FormControl({ value: this.expenseShareModel.ExpenseId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TripMemberId: new FormControl({ value: this.expenseShareModel.TripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ShareAmount: new FormControl({ value: this.expenseShareModel.ShareAmount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Percentage: new FormControl({ value: this.expenseShareModel.Percentage, disabled: this.PageRights.IsReadOnly }),
      ShareUnits: new FormControl({ value: this.expenseShareModel.ShareUnits, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.expenseShareModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns ExpenseShare form data
  get form(): any {
    return this.expenseShareForm.controls;
  }
}
