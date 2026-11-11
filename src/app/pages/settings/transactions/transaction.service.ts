import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class TransactionService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.Transaction.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getTransactionById(transactionId: string) {
        let requestParams = {
            DataId: transactionId
        };

        return this.http
            .HttpPost(this.http.Services.Transaction.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateTransaction(formData: any) {
        return this.http
            .HttpPost(this.http.Services.Transaction.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteTransactionById(transactionIds: string[]) {
        var transactionParams = {
            DeletedIds: transactionIds
        };

        return this.http
            .HttpPost(this.http.Services.Transaction.Delete, transactionParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }
}
