import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { TripInvitationService } from '../trip-invitation.service';
import { TripInvitationModel } from '../trip-invitation.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'trip-invitation',
  templateUrl: './create-trip-invitation.component.html',
  styleUrls: ['./create-trip-invitation.component.scss'],
  standalone: false
})
export class CreateTripInvitationComponent extends BaseComponent<TripInvitationModel> implements OnInit {
  tripInvitationForm!: FormGroup;
  tripInvitationModel!: TripInvitationModel;
  tripList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private tripInvitationService: TripInvitationService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Invitation', active: true }];

    // Set the default tripInvitation Model
    this.tripInvitationModel = new TripInvitationModel();
    this.tripInvitationForm = this.createTripInvitationForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.tripInvitationService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.tripList = results[0].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.tripInvitationModel = new TripInvitationModel();
            this.showHideLoading(false);

          } else {
            let invitationId: string = params.get('invitationId')!

            this.tripInvitationService.getTripInvitationById(invitationId)
              .subscribe((response: any) => {
                this.tripInvitationModel = new TripInvitationModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.tripInvitationModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.tripInvitationModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.tripInvitationForm = this.createTripInvitationForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateTripInvitationDetails() {
    if (!this.tripInvitationForm.valid) {
      this.validateAllFormFields(this.tripInvitationForm);
      return;
    }

    this.setValueFromFormGroup(this.tripInvitationForm, this.tripInvitationModel);

    this.showHideLoading(true);
    this.tripInvitationService.createOrUpdateTripInvitation(this.tripInvitationModel)
      .subscribe((tripInvitationResp: any) => {

        if (tripInvitationResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.TripInvitation.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(tripInvitationResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('TripInvitation deletion errors =>', error);
      });
  }

  //Create tripInvitation form and returns {FormGroup}
  createTripInvitationForm(): FormGroup {
    return this.formBuilder.group({
      InvitationId: new FormControl(this.tripInvitationModel.InvitationId),
      TripId: new FormControl({ value: this.tripInvitationModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      EmailId: new FormControl({ value: this.tripInvitationModel.EmailId, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(150)]),
      TripRole: new FormControl({ value: this.tripInvitationModel.TripRole, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      TokenHash: new FormControl({ value: this.tripInvitationModel.TokenHash, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(500)]),
      ExpiredDate: new FormControl({ value: this.getDateForAPIFromText(this.tripInvitationModel.ExpiredDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      AcceptedDate: new FormControl({ value: this.getDateForAPIFromText(this.tripInvitationModel.AcceptedDate), disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.tripInvitationModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns TripInvitation form data
  get form(): any {
    return this.tripInvitationForm.controls;
  }
}
