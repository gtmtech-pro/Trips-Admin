import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { TripPlaceService } from '../trip-place.service';
import { TripPlaceModel } from '../trip-place.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'trip-place',
  templateUrl: './create-trip-place.component.html',
  styleUrls: ['./create-trip-place.component.scss'],
  standalone: false
})
export class CreateTripPlaceComponent extends BaseComponent<TripPlaceModel> implements OnInit {
  tripPlaceForm!: FormGroup;
  tripPlaceModel!: TripPlaceModel;
  tripDayList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private tripPlaceService: TripPlaceService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Place', active: true }];

    // Set the default tripPlace Model
    this.tripPlaceModel = new TripPlaceModel();
    this.tripPlaceForm = this.createTripPlaceForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.tripPlaceService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.tripDayList = results[0].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.tripPlaceModel = new TripPlaceModel();
            this.showHideLoading(false);

          } else {
            let placeId: string = params.get('placeId')!

            this.tripPlaceService.getTripPlaceById(placeId)
              .subscribe((response: any) => {
                this.tripPlaceModel = new TripPlaceModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.tripPlaceModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.tripPlaceModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.tripPlaceForm = this.createTripPlaceForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateTripPlaceDetails() {
    if (!this.tripPlaceForm.valid) {
      this.validateAllFormFields(this.tripPlaceForm);
      return;
    }

    this.setValueFromFormGroup(this.tripPlaceForm, this.tripPlaceModel);

    this.showHideLoading(true);
    this.tripPlaceService.createOrUpdateTripPlace(this.tripPlaceModel)
      .subscribe((tripPlaceResp: any) => {

        if (tripPlaceResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.TripPlace.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(tripPlaceResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('TripPlace deletion errors =>', error);
      });
  }

  //Create tripPlace form and returns {FormGroup}
  createTripPlaceForm(): FormGroup {
    return this.formBuilder.group({
      PlaceId: new FormControl(this.tripPlaceModel.PlaceId),
      TripDayId: new FormControl({ value: this.tripPlaceModel.TripDayId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      PlaceName: new FormControl({ value: this.tripPlaceModel.PlaceName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(250)]),
      LocationName: new FormControl({ value: this.tripPlaceModel.LocationName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      TripAddress: new FormControl({ value: this.tripPlaceModel.TripAddress, disabled: this.PageRights.IsReadOnly }),
      Description: new FormControl({ value: this.tripPlaceModel.Description, disabled: this.PageRights.IsReadOnly }),
      PlannedVisitDate: new FormControl({ value: this.getDateForAPIFromText(this.tripPlaceModel.PlannedVisitDate), disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      VisitTime: new FormControl({ value: this.getDateForAPIFromText(this.tripPlaceModel.VisitTime), disabled: this.PageRights.IsReadOnly }),
      SortOrder: new FormControl({ value: this.tripPlaceModel.SortOrder, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      Priority: new FormControl({ value: this.tripPlaceModel.Priority, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(50)]),
      Notes: new FormControl({ value: this.tripPlaceModel.Notes, disabled: this.PageRights.IsReadOnly }),
      ImageUrl: new FormControl({ value: this.tripPlaceModel.ImageUrl, disabled: this.PageRights.IsReadOnly }),
      IsVisited: new FormControl({ value: this.tripPlaceModel.IsVisited, disabled: this.PageRights.IsReadOnly }),
      VisitStatus: new FormControl({ value: this.tripPlaceModel.VisitStatus, disabled: this.PageRights.IsReadOnly }),
      IsActive: new FormControl({ value: this.tripPlaceModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns TripPlace form data
  get form(): any {
    return this.tripPlaceForm.controls;
  }
}
