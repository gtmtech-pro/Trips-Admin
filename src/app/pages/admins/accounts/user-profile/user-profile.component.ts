import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AccountService } from '../account.service';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseListComponent } from '../../../../common/base-list/base.list.component';
import { AccountModel } from '../account.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: false
})

export class UserProfileComponent extends BaseListComponent<AccountModel> implements OnInit {
  accountModel: any;
  loginHistories: any;

  constructor(public formBuilder: FormBuilder,
    public accountService: AccountService,
    public dialogService: ShowDialogService,
    override snackBar: MatSnackBar
  ) {
    super(snackBar);
  }

  override ngOnInit(): void {
    this.accountService.getAccountDetailsById(this.UserModel.AccountId).subscribe((response: any) => {
      this.accountModel = response.Result;
    }, (error: any) => {
      console.log(error);
    });

    this.accountService.getLogoutHistoriesById(this.UserModel.AccountId).subscribe((response: any) => {
      this.loginHistories = response.Results;
    }, (error: any) => {
      console.log(error);
    });
  }
}
