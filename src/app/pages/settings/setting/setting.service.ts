import { Injectable } from "@angular/core";
import { retry, catchError, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { BaseService } from '../../../services/base.service';

@Injectable()
export class SettingService {
    constructor(private http: BaseService) { }

    saveSettings(formData: any) {
        return this.http
            .HttpPost(this.http.Services.CommonService.SaveTripSettings, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    compressFiles(formData: any) {
        return this.http
            .HttpPost(this.http.Services.CommonService.CompressUploadedImages, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap(response => {
                    return response;
                })
            );
    }

    getAllRoles(): Observable<any> {
        return this.http
            .HttpPost(this.http.Services.Role.GetAll, {})
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }

    syncTripService(syncApiUrl: string, formData: any): Observable<any> {
        return this.http
            .HttpPost(syncApiUrl, formData)
            .pipe(
                retry(this.http.Services.RetryServieNo),
                catchError(this.http.HandleError),
                tap((response: any) => {
                    return response.Results;
                })
            );
    }
}
