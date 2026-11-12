import { Component, NgZone, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';

import { PaginationService } from '../../../core/services/pagination.service';
import { BaseListComponent } from '../../../common/base-list/base.list.component';
import { ShowDialogService } from '../../../shared/show-dialog.service';
import { TripNoteModel } from './trip-note.model';
import { TripNoteService } from './trip-note.service';

@Component({
  selector: 'data-list-view',
  templateUrl: './trip-note.component.html',
  styleUrls: ['./trip-note.component.scss'],
  standalone: false
})

export class TripNoteComponent extends BaseListComponent<TripNoteModel> implements OnInit {
  tripNoteData!: FormGroup;
  tripNotes: any;
  allTripNotes: any;

  constructor(
    public formBuilder: FormBuilder,
    public tripNoteService: TripNoteService,
    public dialogService: ShowDialogService,
    public zone: NgZone,
    override snackBar: MatSnackBar,
    public paginationService: PaginationService,
    public modalService: NgbModal
  ) {
    super(snackBar);

    // BreadCrumb
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Trip Notes', active: true }];

    this.filterForm = this.createTripNoteFilterForm();

    this.displayedColumns = ['TripName', 'ExpensName', 'NoteTitle', 'NoteText', 'IsActive', 'Actions'];
  }

  override ngOnInit(): void {
    //Load initial tripNotes data
    this.paginationService.PageIndex = 0;
    this.onLoadTripNotesByCriteria();

    this.filterForm.get('SearchText')?.valueChanges.pipe(
      filter((res: any) => {          // if character length greater then 2
        this.paginationService.PageIndex = 0;

        if (res.length == 0) {
          this.filterForm.controls["SearchText"].setValue('');
          this.onLoadTripNotesByCriteria();
          return false;
        }

        return res.length > 2
      }),

      // Time in milliseconds between key events
      debounceTime(650),

      // If previous query is diffent from current
      distinctUntilChanged()

      // subscription for response
    ).subscribe((searchText: string) => {
      this.paginationService.PageIndex = 0;
      this.filterForm.controls["SearchText"].setValue(searchText);

      this.onLoadTripNotesByCriteria();
    });
  }

  onLoadTripNotesByCriteria(): any {
    this.showHideLoading(true);
    let params = this.getTripNoteParams();

    this.tripNoteService.GetAllByCriteria(params).subscribe(response => {
      this.tripNotes = response.Results;
      this.allTripNotes = cloneDeep(response.Results);

      setTimeout(() => {
        this.paginationService.TotalRows = response.TotalResults;
        this.showHideLoading(false);
      }, 200);

    }, (error: any) => {
      console.log(error);
    });
  }

  onLoadTripNotesByFilters(): any {
    this.paginationService.PageIndex = 0;
    this.onLoadTripNotesByCriteria();
  }

  onLoadTripNotesByStatus(transStatus: any): any {
    this.paginationService.PageIndex = 0;
    this.filterForm.controls["Status"].setValue(transStatus);

    this.onLoadTripNotesByCriteria();
  }

  resetTripNotesFilters(): void {
    this.paginationService.PageIndex = 0;
    this.filterForm.reset();

    this.onLoadTripNotesByCriteria();
  }

  onDeleteTripNote(tripNoteIds: string[]) {
    this.dialogService
      .openConfirmDialog(this.Constants.Messages.DeleteConfirmationMessage, 'TripNote')
      .afterClosed()
      .subscribe((confResp: any) => {
        if (confResp) {
          this.showHideLoading(true);

          this.tripNoteService.deleteTripNoteById(tripNoteIds)
            .subscribe((tripNoteResp: any) => {

              if (tripNoteResp.Success) {
                this.zone.run(() => {
                  this.showHideLoading(false);
                  this.showActionMessage(this.Constants.Messages.RecordDeletedMessage, this.Constants.Html.SuccessSnackbar);
                  this.ngOnInit();
                });
              }
            }, (error: any) => {
              console.log('TripNote deletion errors =>', error);
            });
        }
      });
  }

  deleteMultipleTripNotes(): void {
    this.onDeleteTripNote(this.CheckedDeletedIds);
  }

  exportTripNotesData(): void {
    this.showHideLoading(true);

    let params = this.getTripNoteParams();
    params.PageIndex = 0;
    params.PageSize = 100000;

    this.tripNoteService.GetAllByCriteria(params).subscribe(response => {
      response.Results.forEach(
        function (results: any) {
          if (results.hasOwnProperty('IsActive')) {
            results.IsActive = results.IsActive ? 'Yes' : 'No';
          }
          delete results.TripNoteId;
          delete results.TotalRows;
        });

      this.exportExcelFromTable(response.Results, "TripNotes");
      this.showHideLoading(false);
    }, error => {
      console.log(error);
      this.showHideLoading(false);
    });
  }

  //Create TripNote Filters form and returns {FormGroup}
  createTripNoteFilterForm(): FormGroup {
    return this.formBuilder.group({
      SearchText: new FormControl({ value: '', disabled: false }),
      Status: new FormControl({ value: null, disabled: false })
    });
  }

  // Get TripNote Params
  getTripNoteParams(): any {
    let params = {
      AccountId: this.UserModel.AccountId,
      RoleId: this.UserModel.RoleId,
      Name: this.filterForm.controls["SearchText"]?.value,
      Status: JSON.parse(this.filterForm.controls["Status"]?.value),
      PageIndex: this.paginationService.PageIndex,
      PageSize: this.paginationService.PageSize
    };

    return params;
  }

  // TripNotes Pagination
  onPageIndexChanged(evt: any) {
    if (evt.target.text == undefined) return;

    if (evt.target.text == 'Next')
      this.paginationService.PageIndex = this.paginationService.PageIndex + 1;
    else if (evt.target.text == 'Last')
      this.paginationService.PageIndex = Math.ceil(this.paginationService.TotalRows / this.paginationService.PageSize) - 1;
    else if (evt.target.text == 'Prev')
      this.paginationService.PageIndex = this.paginationService.PageIndex - 1;
    else if (evt.target.text == 'First')
      this.paginationService.PageIndex = 0;
    else
      this.paginationService.PageIndex = parseInt(evt.target.text) - 1;

    this.onLoadTripNotesByCriteria();
  }

  // Search Data in TripNotes
  performSearchInTripNotes(): void {
    let searchText = this.filterForm.controls['SearchText'].value;

    let searchResults = this.allTripNotes.filter((item: any) => {
      return (
        item.Code.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.PageTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.tripNotes = this.paginationService.changePage(searchResults)
  }

  // Check/uncheck all tripNote items
  checkUncheckAllTripNotes(evt: any) {
    this.tripNotes.forEach((x: { state: any; }) => x.state = evt.target.checked);
    this.onSelectedTripNote(evt);
  }

  // Check/uncheck selected tripNote
  onSelectedTripNote(evt: any) {
    this.CheckedDeletedIds = [];

    for (var i = 0; i < this.tripNotes.length; i++) {
      if (this.tripNotes[i].state == true) {
        this.CheckedDeletedIds.push(this.tripNotes[i].TripNoteId);
      }
    }
  }

  // Sort TripNotes Data
  onSortTripNotes(column: any) {
    this.tripNotes = this.paginationService.onSort(column, this.allTripNotes)
  }
}
