import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { retry, catchError, tap } from "rxjs/operators";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class FriendService {
    constructor(private http: BaseService) { }

    GetAllByCriteria(filters: any): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.Friend.GetAllByCriteria, filters)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    getFriendById(employeeId: string) {
        let requestParams = {
            DataId: employeeId
        };

        return this.http
            .HttpPost(this.http.Services.Friend.GetById, requestParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(function (response: any) {
                    return response.Results;
                })
            );
    }

    createOrUpdateFriend(formData: any) {
        return this.http
            .HttpPost(this.http.Services.Friend.CreateOrUpdate, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    deleteFriendById(employeeIds: string[]) {
        var friendParams = {
            DeletedIds: employeeIds
        };

        return this.http
            .HttpPost(this.http.Services.Friend.Delete, friendParams)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }
}
