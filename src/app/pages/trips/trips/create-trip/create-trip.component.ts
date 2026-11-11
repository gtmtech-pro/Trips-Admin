import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteConstants } from '../../../../constants/route.constant'
import { TripService } from '../trip.service';
import { TripModel } from '../trip.model';
import { DropdownModel } from '../../../../models/dropdown.model';
import { CommonService } from '../../../../services/common.service';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';

@Component({
  selector: 'trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss'],
  standalone: false
})
export class CreateTripComponent extends BaseComponent<TripModel> implements OnInit {
  tripForm!: FormGroup;
  tripModel!: TripModel;
  accountList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private tripService: TripService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Trips' }, { label: 'Trip', active: true }];

    // Set the default trip Model
    this.tripModel = new TripModel();
    this.tripForm = this.createTripForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.tripService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.accountList = results[0].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.tripModel = new TripModel();
            this.showHideLoading(false);

          } else {
            let tripId: string = params.get('tripId')!

            this.tripService.getTripById(tripId)
              .subscribe((response: any) => {
                this.tripModel = new TripModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.tripModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.tripModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.tripForm = this.createTripForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateTripDetails() {
    if (!this.tripForm.valid) {
      this.validateAllFormFields(this.tripForm);
      return;
    }

    this.setValueFromFormGroup(this.tripForm, this.tripModel);

    this.showHideLoading(true);
    this.tripService.createOrUpdateTrip(this.tripModel)
      .subscribe((tripResp: any) => {

        if (tripResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.Trip.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(tripResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, error => {
        this.showHideLoading(false);
        console.log('Trip deletion errors =>', error);
      });
  }

  //Create trip form and returns {FormGroup}
  createTripForm(): FormGroup {
    return this.formBuilder.group({
      TripId: new FormControl(this.tripModel.TripId),
      OwnerAccountId: new FormControl({ value: this.tripModel.OwnerAccountId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TripName: new FormControl({ value: this.tripModel.TripName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(300)]),
      Destination: new FormControl({ value: this.tripModel.Destination, disabled: this.PageRights.IsReadOnly }),
      StartDate: new FormControl({ value: this.getDateForAPIFromText(this.tripModel.StartDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      EndDate: new FormControl({ value: this.getDateForAPIFromText(this.tripModel.EndDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      TripType: new FormControl({ value: this.tripModel.TripType, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(20)]),
      TripDescription: new FormControl({ value: this.tripModel.TripDescription, disabled: this.PageRights.IsReadOnly }),
      BackgroundImageUrl: new FormControl({ value: this.tripModel.BackgroundImageUrl, disabled: this.PageRights.IsReadOnly }),
      IsShortcut: new FormControl({ value: this.tripModel.IsShortcut, disabled: this.PageRights.IsReadOnly }),
      IsArchived: new FormControl({ value: this.tripModel.IsArchived, disabled: this.PageRights.IsReadOnly }),
      IsDeleted: new FormControl({ value: this.tripModel.IsDeleted, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.tripModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns Trip form data
  get form(): any {
    return this.tripForm.controls;
  }
}
