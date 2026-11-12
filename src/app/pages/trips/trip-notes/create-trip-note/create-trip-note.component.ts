import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowDialogService } from '../../../../shared/show-dialog.service';
import { BaseComponent } from '../../../../common/base/base.component';
import { CommonService } from '../../../../services/common.service';
import { RouteConstants } from '../../../../constants/route.constant';
import { TripNoteService } from '../trip-note.service';
import { TripNoteModel } from '../trip-note.model';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'trip-note',
  templateUrl: './create-trip-note.component.html',
  styleUrls: ['./create-trip-note.component.scss'],
  standalone: false
})
export class CreateTripNoteComponent extends BaseComponent<TripNoteModel> implements OnInit {
  tripNoteForm!: FormGroup;
  tripNoteModel!: TripNoteModel;
  expensList!: DropdownModel[];
  tripList!: DropdownModel[];

  constructor(override commonService: CommonService,
    override router: Router,
    override route: ActivatedRoute,
    override snackBar: MatSnackBar,
    private zone: NgZone,
    private tripNoteService: TripNoteService,
    private dialogService: ShowDialogService,
    private formBuilder: FormBuilder) {
    super(commonService, router, route, snackBar);

    this.BreadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Note', active: true }];

    // Set the default tripNote Model
    this.tripNoteModel = new TripNoteModel();
    this.tripNoteForm = this.createTripNoteForm();
  }

  override ngOnInit(): void {
    this.showHideLoading(true);
    this.tripNoteService.getMasterDataForDropdown().subscribe((results: any) => {
      if (results[0].Success) {
        this.expensList = results[0].Results;
      }

      if (results[1].Success) {
        this.tripList = results[1].Results;
      }

      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          this.PageRights.ActionType = params.get('actionType')!;

          if (this.PageRights.ActionType == this.Constants.Actions.New) {
            this.tripNoteModel = new TripNoteModel();
            this.showHideLoading(false);

          } else {
            let tripNoteId: string = params.get('tripNoteId')!

            this.tripNoteService.getTripNoteById(tripNoteId)
              .subscribe((response: any) => {
                this.tripNoteModel = new TripNoteModel(response.Result);

                if (this.PageRights.ActionType == this.Constants.Actions.Edit)
                  this.tripNoteModel.RequestType = this.Constants.PageType.Edit;
                else if (this.PageRights.ActionType == this.Constants.Actions.View) {
                  this.tripNoteModel.RequestType = this.Constants.PageType.View;
                  this.PageRights.IsReadOnly = true;
                }

                this.tripNoteForm = this.createTripNoteForm();
                this.showHideLoading(false);
              });
          }
        }
      });
    });
  }

  saveOrUpdateTripNoteDetails() {
    if (!this.tripNoteForm.valid) {
      this.validateAllFormFields(this.tripNoteForm);
      return;
    }

    this.setValueFromFormGroup(this.tripNoteForm, this.tripNoteModel);

    this.showHideLoading(true);
    this.tripNoteService.createOrUpdateTripNote(this.tripNoteModel)
      .subscribe((tripNoteResp: any) => {

        if (tripNoteResp.Success) {
          this.zone.run(() => {
            this.showActionMessage(this.Constants.Messages.RecordSavedMessage, this.Constants.Html.SuccessSnackbar);
            this.router.navigate([RouteConstants.TripNote.List]);
          });
        }
        else {
          var errorMessages = this.getHtmlMessage(tripNoteResp.Errors)
          this.dialogService.openShowDialog(errorMessages);
        }
        this.showHideLoading(false);
      }, (error: any) => {
        this.showHideLoading(false);
        console.log('TripNote deletion errors =>', error);
      });
  }

  //Create tripNote form and returns {FormGroup}
  createTripNoteForm(): FormGroup {
    return this.formBuilder.group({
      TripNoteId: new FormControl(this.tripNoteModel.TripNoteId),
      TripId: new FormControl({ value: this.tripNoteModel.TripId, disabled: this.PageRights.IsReadOnly }, [Validators.required]),
      ExpenseId: new FormControl({ value: this.tripNoteModel.ExpenseId, disabled: this.PageRights.IsReadOnly }),
      NoteTitle: new FormControl({ value: this.tripNoteModel.NoteTitle, disabled: this.PageRights.IsReadOnly }),
      NoteText: new FormControl({ value: this.tripNoteModel.NoteText, disabled: this.PageRights.IsReadOnly }, [Validators.required, Validators.maxLength(3500)]),
      IsActive: new FormControl({ value: this.tripNoteModel.IsActive, disabled: this.PageRights.IsReadOnly }),
    });
  }

  // Returns TripNote form data
  get form(): any {
    return this.tripNoteForm.controls;
  }
}
