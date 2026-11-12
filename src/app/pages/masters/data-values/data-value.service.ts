import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class DataValueService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.DataValue.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getDataValueById(dataValueId: string) {
        let requestParams = {
            DataId: dataValueId
        };

        return this.http
            .HttpPost(this.http.Services.DataValue.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateDataValue(formData: any) {
        return this.http
            .HttpPost(this.http.Services.DataValue.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteDataValueById(dataValueIds: string[]) {
        var dataValueParams = {
            DeletedDataValueIds: dataValueIds
        };

        return this.http
            .HttpPost(this.http.Services.DataValue.Delete, dataValueParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getMasterDataForDropdown(): Observable<any[]> {
        let dataTypeRequest = this.http.GetMasterDataByType({ DataType: 'DataTypes', SelectTitle: 'Select Data Type' });

        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([dataTypeRequest]);
    }
}
