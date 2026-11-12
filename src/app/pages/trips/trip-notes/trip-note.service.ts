import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class TripNoteService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.TripNote.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getTripNoteById(tripNoteId: string) {
        let requestParams = {
            DataId: tripNoteId
        };

        return this.http
            .HttpPost(this.http.Services.TripNote.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateTripNote(formData: any) {
        return this.http
            .HttpPost(this.http.Services.TripNote.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteTripNoteById(tripNoteIds: string[]) {
        var tripNoteParams = {
            DeletedIds: tripNoteIds
        };

        return this.http
            .HttpPost(this.http.Services.TripNote.Delete, tripNoteParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let expensRequest = this.http.GetMasterDataByType({ DataType: 'Expenses', SelectTitle: 'Select Expens' });
        let tripRequest = this.http.GetMasterDataByType({ DataType: 'Trips', SelectTitle: 'Select Trip' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([expensRequest, tripRequest]);
    }
}
