import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class AccountTransactionService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.AccountTransaction.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getAccountTransactionById(accountTransactionId: string) {
        let requestParams = {
            DataId: accountTransactionId
        };

        return this.http
            .HttpPost(this.http.Services.AccountTransaction.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateAccountTransaction(formData: any) {
        return this.http
            .HttpPost(this.http.Services.AccountTransaction.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteAccountTransactionById(accountTransactionIds: string[]) {
        var accountTransactionParams = {
            DeletedIds: accountTransactionIds
        };

        return this.http
            .HttpPost(this.http.Services.AccountTransaction.Delete, accountTransactionParams)
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
        let transactionRequest = this.http.GetMasterDataByType({ DataType: 'Transactions', SelectTitle: 'Select Transaction' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([accountRequest, transactionRequest]);
    }
}
