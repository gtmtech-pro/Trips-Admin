import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class TripMemberService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.TripMember.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getTripMemberById(tripMemberId: string) {
        let requestParams = {
            DataId: tripMemberId
        };

        return this.http
            .HttpPost(this.http.Services.TripMember.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateTripMember(formData: any) {
        return this.http
            .HttpPost(this.http.Services.TripMember.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteTripMemberById(tripMemberIds: string[]) {
        var tripMemberParams = {
            DeletedIds: tripMemberIds
        };

        return this.http
            .HttpPost(this.http.Services.TripMember.Delete, tripMemberParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }
}
