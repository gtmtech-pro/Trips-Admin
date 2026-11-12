import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { TripPackingItemService } from '../trip-packing-item.service';
import { TripPackingItemModel } from '../trip-packing-item.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'trip-packing-item',
  templateUrl: './create-trip-packing-item.component.html',
  styleUrls: ['./create-trip-packing-item.component.scss'],
  standalone: false
})
export class CreateTripPackingItemComponent extends BaseComponent<TripPackingItemModel> implements OnInit {
  tripPackingItemForm!: FormGroup;
  tripPackingItemModel!: TripPackingItemModel;
  tripList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private tripPackingItemService: TripPackingItemService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Packing Item', active: true }];

    // Set the default tripPackingItem Model
    this.tripPackingItemModel = new TripPackingItemModel();
    this.tripPackingItemForm = this.createTripPackingItemForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.tripPackingItemService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.tripList = results[0].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.tripPackingItemModel = new TripPackingItemModel();
            this.showHideLoading(false);

          } else {
            let packingItemId: string = params.get('packingItemId')!

            this.tripPackingItemService.getTripPackingItemById(packingItemId)
              .subscribe((response: any) => {
                this.tripPackingItemModel = new TripPackingItemModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.tripPackingItemModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.tripPackingItemModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.tripPackingItemForm = this.createTripPackingItemForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateTripPackingItemDetails() {
    if (!this.tripPackingItemForm.valid) {
      this.validateAllFormFields(this.tripPackingItemForm);
      return;
    }

    this.setValueFromFormGroup(this.tripPackingItemForm, this.tripPackingItemModel);

    this.showHideLoading(true);
    this.tripPackingItemService.createOrUpdateTripPackingItem(this.tripPackingItemModel)
      .subscribe((tripPackingItemResp: any) => {

        if (tripPackingItemResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.TripPackingItem.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(tripPackingItemResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('TripPackingItem deletion errors =>', error);
      });
  }

  //Create tripPackingItem form and returns {FormGroup}
  createTripPackingItemForm(): FormGroup {
    return this.formBuilder.group({
      PackingItemId: new FormControl(this.tripPackingItemModel.PackingItemId),
      TripId: new FormControl({ value: this.tripPackingItemModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      CategoryName: new FormControl({ value: this.tripPackingItemModel.CategoryName, disabled: this.PageRights.IsReadOnly }),
      ItemName: new FormControl({ value: this.tripPackingItemModel.ItemName, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(250)]),
      Quantity: new FormControl({ value: this.tripPackingItemModel.Quantity, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      IsPacked: new FormControl({ value: this.tripPackingItemModel.IsPacked, disabled: this.PageRights.IsReadOnly }),
      Notes: new FormControl({ value: this.tripPackingItemModel.Notes, disabled: this.PageRights.IsReadOnly }),
      SortOrder: new FormControl({ value: this.tripPackingItemModel.SortOrder, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      IsActive: new FormControl({ value: this.tripPackingItemModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns TripPackingItem form data
  get form(): any {
    return this.tripPackingItemForm.controls;
  }
}
