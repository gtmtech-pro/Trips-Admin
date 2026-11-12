import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class DepositService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.Deposit.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getDepositById(depositId: string) {
        let requestParams = {
            DataId: depositId
        };

        return this.http
            .HttpPost(this.http.Services.Deposit.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateDeposit(formData: any) {
        return this.http
            .HttpPost(this.http.Services.Deposit.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteDepositById(depositIds: string[]) {
        var depositParams = {
            DeletedIds: depositIds
        };

        return this.http
            .HttpPost(this.http.Services.Deposit.Delete, depositParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let tripMemberRequest = this.http.GetMasterDataByType({ DataType: 'TripMembers', SelectTitle: 'Select Trip Member' });
        let tripRequest = this.http.GetMasterDataByType({ DataType: 'Trips', SelectTitle: 'Select Trip' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([tripMemberRequest, tripRequest]);
    }
}
