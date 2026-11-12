import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { TripMemberService } from '../trip-member.service';
import { TripMemberModel } from '../trip-member.model';

@Component({
  selector: 'trip-member',
  templateUrl: './create-trip-member.component.html',
  styleUrls: ['./create-trip-member.component.scss'],
  standalone: false
})
export class CreateTripMemberComponent extends BaseComponent<TripMemberModel> implements OnInit {
  tripMemberForm!: FormGroup;
  tripMemberModel!: TripMemberModel;
  tripList!: any[];
  userList!: any[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private tripMemberService: TripMemberService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Member', active: true }];

    // Set the default tripMember Model
    this.tripMemberModel = new TripMemberModel();
    this.tripMemberForm = this.createTripMemberForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        this.PageRights.ActionType = params.get('actionType')!;

        if (this.PageRights.ActionType == this.Constants.Actions.New) {
          this.tripMemberModel = new TripMemberModel();
          this.showHideLoading(false);

        } else {
          let tripMemberId: string = params.get('tripMemberId')!

          this.tripMemberService.getTripMemberById(tripMemberId)
            .subscribe((response: any) => {
              this.tripMemberModel = response.Result;

              if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                this.tripMemberModel.RequestType = this.Constants.PageType.Edit;
              else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                this.tripMemberModel.RequestType = this.Constants.PageType.View;
                this.PageRights.IsReadOnly = true;
              }

              this.tripMemberForm = this.createTripMemberForm();
              this.showHideLoading(false);
            });
        }
      }
    });
  }

  saveOrUpdateTripMemberDetails() {
    if (!this.tripMemberForm.valid) {
      this.validateAllFormFields(this.tripMemberForm);
      return;
    }

    this.setValueFromFormGroup(this.tripMemberForm, this.tripMemberModel);

    this.showHideLoading(true);
    this.tripMemberService.createOrUpdateTripMember(this.tripMemberModel)
      .subscribe((tripMemberResp: any) => {

        if (tripMemberResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.TripMember.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(tripMemberResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('TripMember deletion errors =>', error);
      });
  }

  //Create tripMember form and returns {FormGroup}
  createTripMemberForm(): FormGroup {
    return this.formBuilder.group({
      TripMemberId: new FormControl(this.tripMemberModel.TripMemberId),
      TripId: new FormControl({ value: this.tripMemberModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      UserId: new FormControl({ value: this.tripMemberModel.UserId, disabled: this.PageRights.IsReadOnly }),
      MemberName: new FormControl({ value: this.tripMemberModel.MemberName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(150)]),
      EmailId: new FormControl({ value: this.tripMemberModel.EmailId, disabled: this.PageRights.IsReadOnly }),
      MobileNo: new FormControl({ value: this.tripMemberModel.MobileNo, disabled: this.PageRights.IsReadOnly }),
      JoinedDate: new FormControl({ value: this.getDateForAPIFromText(this.tripMemberModel.JoinedDate), disabled: this.PageRights.IsReadOnly }),
      ProfileImageUrl: new FormControl({ value: this.tripMemberModel.ProfileImageUrl, disabled: this.PageRights.IsReadOnly }),
      TripRole: new FormControl({ value: this.tripMemberModel.TripRole, disabled: this.PageRights.IsReadOnly }),
      MemberStatus: new FormControl({ value: this.tripMemberModel.MemberStatus, disabled: this.PageRights.IsReadOnly }),
      IsOwner: new FormControl({ value: this.tripMemberModel.IsOwner, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.tripMemberModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns TripMember form data
  get form(): any {
    return this.tripMemberForm.controls;
  }
}
