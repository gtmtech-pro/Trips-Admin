import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class ExpenseService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.Expense.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getExpenseById(expenseId: string) {
        let requestParams = {
            DataId: expenseId
        };

        return this.http
            .HttpPost(this.http.Services.Expense.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateExpense(formData: any) {
        return this.http
            .HttpPost(this.http.Services.Expense.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteExpenseById(expenseIds: string[]) {
        var expensParams = {
            DeletedIds: expenseIds
        };

        return this.http
            .HttpPost(this.http.Services.Expense.Delete, expensParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let expenseCategoryRequest = this.http.GetMasterDataByType({ DataType: 'ExpenseCategories', SelectTitle: 'Select Expense Category' });
        let tripMemberRequest = this.http.GetMasterDataByType({ DataType: 'TripMembers', SelectTitle: 'Select Trip Member' });
        let tripRequest = this.http.GetMasterDataByType({ DataType: 'Trips', SelectTitle: 'Select Trip' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([expenseCategoryRequest, tripMemberRequest, tripRequest]);
    }
}
