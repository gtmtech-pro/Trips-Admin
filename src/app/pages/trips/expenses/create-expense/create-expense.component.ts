import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { ExpenseService } from '../expense.service';
import { ExpenseModel } from '../expense.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss'],
  standalone: false
})
export class CreateExpenseComponent extends BaseComponent<ExpenseModel> implements OnInit {
  expenseForm!: FormGroup;
  expenseModel!: ExpenseModel;
  expenseCategoryList!: DropdownModel[];
  tripMemberList!: DropdownModel[];
  tripList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private expenseService: ExpenseService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Expense', active: true }];

    // Set the default expense Model
    this.expenseModel = new ExpenseModel();
    this.expenseForm = this.createExpenseForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.expenseService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.expenseCategoryList = results[0].Results;
      }

      if (results[1].Success) {
        this.tripMemberList = results[1].Results;
      }

      if (results[2].Success) {
        this.tripList = results[2].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.expenseModel = new ExpenseModel();
            this.showHideLoading(false);

          } else {
            let expenseId: string = params.get('expenseId')!

            this.expenseService.getExpenseById(expenseId)
              .subscribe((response: any) => {
                this.expenseModel = new ExpenseModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.expenseModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.expenseModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.expenseForm = this.createExpenseForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateExpenseDetails() {
    if (!this.expenseForm.valid) {
      this.validateAllFormFields(this.expenseForm);
      return;
    }

    this.setValueFromFormGroup(this.expenseForm, this.expenseModel);

    this.showHideLoading(true);
    this.expenseService.createOrUpdateExpense(this.expenseModel)
      .subscribe((expenseResp: any) => {

        if (expenseResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Expense.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(expenseResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Expens deletion errors =>', error);
      });
  }

  //Create expense form and returns {FormGroup}
  createExpenseForm(): FormGroup {
    return this.formBuilder.group({
      ExpenseId: new FormControl(this.expenseModel.ExpenseId),
      TripId: new FormControl({ value: this.expenseModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      CategoryId: new FormControl({ value: this.expenseModel.CategoryId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ExpenseTitle: new FormControl({ value: this.expenseModel.ExpenseTitle, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(250)]),
      Description: new FormControl({ value: this.expenseModel.Description, disabled: this.PageRights.IsReadOnly }),
      PaidByTripMemberId: new FormControl({ value: this.expenseModel.PaidByTripMemberId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      OriginalAmount: new FormControl({ value: this.expenseModel.OriginalAmount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      BaseAmount: new FormControl({ value: this.expenseModel.BaseAmount, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ExpenseDate: new FormControl({ value: this.getDateForAPIFromText(this.expenseModel.ExpenseDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      SplitMethod: new FormControl({ value: this.expenseModel.SplitMethod, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      IsDeleted: new FormControl({ value: this.expenseModel.IsDeleted, disabled: this.PageRights.IsReadOnly }),
      ExpenseStatus: new FormControl({ value: this.expenseModel.ExpenseStatus, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(30)]),
      IsActive: new FormControl({ value: this.expenseModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Expens form data
  get form(): any {
    return this.expenseForm.controls;
  }
}
