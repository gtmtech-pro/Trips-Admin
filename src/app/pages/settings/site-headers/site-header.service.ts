import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class SiteHeaderService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.SiteHeader.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getSiteHeaderById(siteHeaderId: string) {
        let requestParams = {
            DataId: siteHeaderId
        };

        return this.http
            .HttpPost(this.http.Services.SiteHeader.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateSiteHeader(formData: any) {
        return this.http
            .HttpPost(this.http.Services.SiteHeader.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteSiteHeaderById(siteHeaderIds: string[]) {
        var siteHeaderParams = {
            DeletedIds: siteHeaderIds
        };

        return this.http
            .HttpPost(this.http.Services.SiteHeader.Delete, siteHeaderParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let siteHeaderRequest = this.http.GetMasterDataByType({ DataType: 'SiteHeaders', SelectTitle: 'Select Parent Site Header' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([siteHeaderRequest]);
    }
}
