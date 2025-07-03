import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';

import { Observable } from 'rxjs';
import { PaginatedParamsOptions } from '../paginated-data.dto';

@Injectable({
    providedIn: 'root',
})
export class AdminDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    GetAdminsPaginated(params?: PaginatedParamsOptions) {
        // let httpParams = new HttpParams();
        // if (params) {
        //     if (params.page !== undefined) {
        //         httpParams = httpParams.append('page', params.page.toString());
        //     }
        //     if (params.limit !== undefined) {
        //         httpParams = httpParams.append(
        //             'limit',
        //             params.limit.toString()
        //         );
        //     }
        // }
        // return this.http.get<PaginatedData<AdminDTO>>(`${this.apiUrl}/admin`, {
        //     params: httpParams,
        // });
    }
}
