import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class TripDayService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.TripDay.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getTripDayById(tripDayId: string) {
        let requestParams = {
            DataId: tripDayId
        };

        return this.http
            .HttpPost(this.http.Services.TripDay.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateTripDay(formData: any) {
        return this.http
            .HttpPost(this.http.Services.TripDay.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteTripDayById(tripDayIds: string[]) {
        var tripDayParams = {
            DeletedIds: tripDayIds
        };

        return this.http
            .HttpPost(this.http.Services.TripDay.Delete, tripDayParams)
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
