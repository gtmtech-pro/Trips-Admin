import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class SiteSubHeaderService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.SiteSubHeader.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getSiteSubHeaderById(siteSubHeaderId: string) {
        let requestParams = {
            DataId: siteSubHeaderId
        };

        return this.http
            .HttpPost(this.http.Services.SiteSubHeader.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateSiteSubHeader(formData: any) {
        return this.http
            .HttpPost(this.http.Services.SiteSubHeader.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteSiteSubHeaderById(siteSubHeaderIds: string[]) {
        var siteSubHeaderParams = {
            DeletedIds: siteSubHeaderIds
        };

        return this.http
            .HttpPost(this.http.Services.SiteSubHeader.Delete, siteSubHeaderParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let siteHeaderRequest = this.http.GetMasterDataByType({ DataType: 'SiteHeaders', SelectTitle: 'Select Site Header' });
        let transactionRequest = this.http.GetMasterDataByType({ DataType: 'Transactions', SelectTitle: 'Select Transaction' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([siteHeaderRequest, transactionRequest]);
    }
}
