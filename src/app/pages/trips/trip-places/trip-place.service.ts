import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class TripPlaceService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.TripPlace.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getTripPlaceById(placeId: string) {
        let requestParams = {
            DataId: placeId
        };

        return this.http
            .HttpPost(this.http.Services.TripPlace.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateTripPlace(formData: any) {
        return this.http
            .HttpPost(this.http.Services.TripPlace.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteTripPlaceById(placeIds: string[]) {
        var tripPlaceParams = {
            DeletedIds: placeIds
        };

        return this.http
            .HttpPost(this.http.Services.TripPlace.Delete, tripPlaceParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let tripDayRequest = this.http.GetMasterDataByType({ DataType: 'TripDays', SelectTitle: 'Select Trip Day' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([tripDayRequest]);
    }
}
