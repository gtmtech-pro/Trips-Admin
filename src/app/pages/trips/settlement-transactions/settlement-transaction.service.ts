import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class SettlementTransactionService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.SettlementTransaction.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getSettlementTransactionById(settlementTransactionId: string) {
        let requestParams = {
            DataId: settlementTransactionId
        };

        return this.http
            .HttpPost(this.http.Services.SettlementTransaction.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateSettlementTransaction(formData: any) {
        return this.http
            .HttpPost(this.http.Services.SettlementTransaction.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteSettlementTransactionById(settlementTransactionIds: string[]) {
        var settlementTransactionParams = {
            DeletedIds: settlementTransactionIds
        };

        return this.http
            .HttpPost(this.http.Services.SettlementTransaction.Delete, settlementTransactionParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let settlementRequest = this.http.GetMasterDataByType({ DataType: 'Settlements', SelectTitle: 'Select Settlement' });
        let tripMemberRequest = this.http.GetMasterDataByType({ DataType: 'TripMembers', SelectTitle: 'Select Trip Member' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([settlementRequest, tripMemberRequest]);
    }
}
