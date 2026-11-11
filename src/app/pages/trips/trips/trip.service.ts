import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from "../../../services/base.service";

@Injectable()
export class TripService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.Trip.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getTripById(tripId: string) {
        let requestParams = {
            DataId: tripId
        };

        return this.http
            .HttpPost(this.http.Services.Trip.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateTrip(formData: any) {
        return this.http
            .HttpPost(this.http.Services.Trip.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteTripById(tripIds: string[]) {
        var tripParams = {
            DeletedIds: tripIds
        };

        return this.http
            .HttpPost(this.http.Services.Trip.Delete, tripParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let accountRequest = this.http.GetMasterDataByType({ DataType: 'Accounts', SelectTitle: 'Select Account' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([accountRequest]);
    }
}
