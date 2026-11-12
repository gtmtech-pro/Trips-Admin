import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { FriendService } from '../friend.service';
import { FriendModel } from '../friend.model';

@Component({
  selector: 'friend',
  templateUrl: './create-friend.component.html',
  styleUrls: ['./create-friend.component.scss'],
  standalone: false
})
export class CreateFriendComponent extends BaseComponent<FriendModel> implements OnInit {
  friendForm!: FormGroup;
  friendModel!: FriendModel;

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private friendService: FriendService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Friend', active: true }];

    // Set the default friend Model
    this.friendModel = new FriendModel();
    this.friendForm = this.createFriendForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.PageRights.ActionType = params.get('actionType')!;

        if (this.PageRights.ActionType == this.Constants.Actions.New) {
          this.friendModel = new FriendModel();
          this.showHideLoading(false);

        } else {
          let employeeId: string = params.get('employeeId')!

          this.friendService.getFriendById(employeeId)
            .subscribe((response: any) => {
              this.friendModel = response.Result;

              if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                this.friendModel.RequestType = this.Constants.PageType.Edit;
              else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                this.friendModel.RequestType = this.Constants.PageType.View;
                this.PageRights.IsReadOnly = true;
              }

              this.friendForm = this.createFriendForm();
              this.showHideLoading(false);
            });
        }
      }
    });
  }

  saveOrUpdateFriendDetails() {
    if (!this.friendForm.valid) {
      this.validateAllFormFields(this.friendForm);
      return;
    }

    this.setValueFromFormGroup(this.friendForm, this.friendModel);

    this.showHideLoading(true);
    this.friendService.createOrUpdateFriend(this.friendModel)
      .subscribe((friendResp: any) => {

        if (friendResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Friend.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(friendResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('Friend deletion errors =>', error);
      });
  }

  //Create friend form and returns {FormGroup}
  createFriendForm(): FormGroup {
    return this.formBuilder.group({
      EmployeeId: new FormControl(this.friendModel.EmployeeId),
      EmployeeCode: new FormControl({ value: this.friendModel.EmployeeCode, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(35)]),
      FirstName: new FormControl({ value: this.friendModel.FirstName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      MiddleName: new FormControl({ value: this.friendModel.MiddleName, disabled: this.PageRights.IsReadOnly }),
      LastName: new FormControl({ value: this.friendModel.LastName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      EmployeeName: new FormControl({ value: this.friendModel.EmployeeName, disabled: this.PageRights.IsReadOnly }),
      Gender: new FormControl({ value: this.friendModel.Gender, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(20)]),
      Age: new FormControl({ value: this.friendModel.Age, disabled: this.PageRights.IsReadOnly }),
      DateOfBirth: new FormControl({ value: this.getDateForAPIFromText(this.friendModel.DateOfBirth), disabled: this.PageRights.IsReadOnly }),
      MaritalStatus: new FormControl({ value: this.friendModel.MaritalStatus, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      MobileNo: new FormControl({ value: this.friendModel.MobileNo, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(15)]),
      EmailId: new FormControl({ value: this.friendModel.EmailId, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(120)]),
      DateOfJoining: new FormControl({ value: this.getDateForAPIFromText(this.friendModel.DateOfJoining), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      AadhaarNo: new FormControl({ value: this.friendModel.AadhaarNo, disabled: this.PageRights.IsReadOnly }),
      PAN: new FormControl({ value: this.friendModel.PAN, disabled: this.PageRights.IsReadOnly }),
      ProfileImage: new FormControl({ value: this.friendModel.ProfileImage, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.friendModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Friend form data
  get form(): any {
    return this.friendForm.controls;
  }
}
