import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class RoleTransactionService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.RoleTransaction.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getRoleTransactionById(roleTransactionId: string) {
        let requestParams = {
            DataId: roleTransactionId
        };

        return this.http
            .HttpPost(this.http.Services.RoleTransaction.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateRoleTransaction(formData: any) {
        return this.http
            .HttpPost(this.http.Services.RoleTransaction.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteRoleTransactionById(roleTransactionIds: string[]) {
        var roleTransactionParams = {
            DeletedIds: roleTransactionIds
        };

        return this.http
            .HttpPost(this.http.Services.RoleTransaction.Delete, roleTransactionParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let roleRequest = this.http.GetMasterDataByType({ DataType: 'Roles', SelectTitle: 'Select Role' });
        let departmentRequest = this.http.GetMasterDataByType({ DataType: 'Departments', SelectTitle: 'Select Department' });
        let designationRequest = this.http.GetMasterDataByType({ DataType: 'Positions', SelectTitle: 'Select Designation' });
        let transactionRequest = this.http.GetMasterDataByType({ DataType: 'Transactions', SelectTitle: 'Select Transaction' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([roleRequest, departmentRequest, designationRequest, transactionRequest]);
    }
}
