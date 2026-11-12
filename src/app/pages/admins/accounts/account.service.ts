import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class AccountService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.Account.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getAccountById(accountId: string) {
        let requestParams = {
            DataId: accountId
        };

        return this.http
            .HttpPost(this.http.Services.Account.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    getEmployeeDetailsById(employeeId: string) {
        let requestParams = {
            DataId: employeeId
        };

        return this.http
            .HttpPost(this.http.Services.Account.GetEmployeeDetailsById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateAccount(formData: any) {
        return this.http
            .HttpPost(this.http.Services.Account.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteAccountById(accountIds: string[]) {
        var accountParams = {
            DeletedIds: accountIds
        };

        return this.http
            .HttpPost(this.http.Services.Account.Delete, accountParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getLogoutHistoriesById(accountId: string) {
        let requestParams = {
            DataId: accountId
        };

        return this.http
            .HttpPost(this.http.Services.Account.GetLogoutHistoriesById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getAccountDetailsById(accountId: string) {
        let requestParams = {
            DataId: accountId
        };

        return this.http
            .HttpPost(this.http.Services.Account.GetAccountDetailsById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getEmployeesByReportingManagerId(requestParams: any) {
        return this.http
            .HttpPost(this.http.Services.Account.GetEmployeesByReportingManagerId, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    saveEmployeeReportingManagers(employeeData: any) {
        return this.http
            .HttpPost(this.http.Services.Account.SaveEmployeesforReportingManager, employeeData)
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
        let employeeRequest = this.http.GetMasterDataByType({ DataType: 'Employees', SelectTitle: 'Select Employee' });
        let reportingToRequest = this.http.GetMasterDataByType({ DataType: 'ReportingTo', SelectTitle: 'Select Reporting To' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([roleRequest, departmentRequest, designationRequest, employeeRequest, reportingToRequest]);
    }

    getReportingMasterDataForDropdown(): Observable<any[]> {
        let reportingToRequest = this.http.GetMasterDataByType({ DataType: 'ReportingTo', SelectTitle: 'Select Reporting To' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([reportingToRequest]);
    }

}
