import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { TripDayService } from '../trip-day.service';
import { TripDayModel } from '../trip-day.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'trip-day',
  templateUrl: './create-trip-day.component.html',
  styleUrls: ['./create-trip-day.component.scss'],
  standalone: false
})
export class CreateTripDayComponent extends BaseComponent<TripDayModel> implements OnInit {
  tripDayForm!: FormGroup;
  tripDayModel!: TripDayModel;
  tripList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private tripDayService: TripDayService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Day', active: true }];

    // Set the default tripDay Model
    this.tripDayModel = new TripDayModel();
    this.tripDayForm = this.createTripDayForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.tripDayService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.tripList = results[0].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.tripDayModel = new TripDayModel();
            this.showHideLoading(false);

          } else {
            let tripDayId: string = params.get('tripDayId')!

            this.tripDayService.getTripDayById(tripDayId)
              .subscribe((response: any) => {
                this.tripDayModel = new TripDayModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.tripDayModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.tripDayModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.tripDayForm = this.createTripDayForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateTripDayDetails() {
    if (!this.tripDayForm.valid) {
      this.validateAllFormFields(this.tripDayForm);
      return;
    }

    this.setValueFromFormGroup(this.tripDayForm, this.tripDayModel);

    this.showHideLoading(true);
    this.tripDayService.createOrUpdateTripDay(this.tripDayModel)
      .subscribe((tripDayResp: any) => {

        if (tripDayResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.TripDay.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(tripDayResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('TripDay deletion errors =>', error);
      });
  }

  //Create tripDay form and returns {FormGroup}
  createTripDayForm(): FormGroup {
    return this.formBuilder.group({
      TripDayId: new FormControl(this.tripDayModel.TripDayId),
      TripId: new FormControl({ value: this.tripDayModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      DayNumber: new FormControl({ value: this.tripDayModel.DayNumber, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TripDate: new FormControl({ value: this.getDateForAPIFromText(this.tripDayModel.TripDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Title: new FormControl({ value: this.tripDayModel.Title, disabled: this.PageRights.IsReadOnly }),
      Notes: new FormControl({ value: this.tripDayModel.Notes, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.tripDayModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns TripDay form data
  get form(): any {
    return this.tripDayForm.controls;
  }
}
