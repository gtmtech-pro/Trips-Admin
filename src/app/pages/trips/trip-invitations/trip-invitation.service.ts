import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class TripInvitationService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.TripInvitation.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getTripInvitationById(invitationId: string) {
        let requestParams = {
            DataId: invitationId
        };

        return this.http
            .HttpPost(this.http.Services.TripInvitation.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateTripInvitation(formData: any) {
        return this.http
            .HttpPost(this.http.Services.TripInvitation.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteTripInvitationById(invitationIds: string[]) {
        var tripInvitationParams = {
            DeletedIds: invitationIds
        };

        return this.http
            .HttpPost(this.http.Services.TripInvitation.Delete, tripInvitationParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let tripRequest = this.http.GetMasterDataByType({ DataType: 'Trips', SelectTitle: 'Select Trip' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([tripRequest]);
    }
}
