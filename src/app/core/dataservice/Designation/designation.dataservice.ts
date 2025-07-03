// export async function getDivisionByDepartment(id) {
//     return await axios.get(
//         `${efilingServiceApi}/api/divisions/department/${id}`
//     );
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { DesignationDTO } from './designation.dto';

@Injectable({
    providedIn: 'root',
})
export class DesignationDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}

    GetAllDesignations(): Observable<DesignationDTO[]> {
        return this.http.get<DesignationDTO[]>(`${this.apiUrl}/designation`);
    }
}
