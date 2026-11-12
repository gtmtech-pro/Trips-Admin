import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class ExpenseShareService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.ExpenseShare.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getExpenseShareById(expenseShareId: string) {
        let requestParams = {
            DataId: expenseShareId
        };

        return this.http
            .HttpPost(this.http.Services.ExpenseShare.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateExpenseShare(formData: any) {
        return this.http
            .HttpPost(this.http.Services.ExpenseShare.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteExpenseShareById(expenseShareIds: string[]) {
        var expenseShareParams = {
            DeletedIds: expenseShareIds
        };

        return this.http
            .HttpPost(this.http.Services.ExpenseShare.Delete, expenseShareParams)
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
        let tripMemberRequest = this.http.GetMasterDataByType({ DataType: 'TripMembers', SelectTitle: 'Select Trip Member' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([expensRequest, tripMemberRequest]);
    }
}
