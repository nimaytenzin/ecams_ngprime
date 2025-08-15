// export async function getDivisionByDepartment(id) {
//     return await axios.get(
//         `${efilingServiceApi}/api/divisions/department/${id}`
//     );
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { CreateDesignationDTO, DesignationDTO } from './designation.dto';

@Injectable({
    providedIn: 'root',
})
export class DesignationDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}

    GetAllDesignations(): Observable<DesignationDTO[]> {
        return this.http.get<DesignationDTO[]>(`${this.apiUrl}/designation`);
    }

    CreateNewDesignation(
        data: CreateDesignationDTO
    ): Observable<DesignationDTO> {
        return this.http.post<DesignationDTO>(
            `${this.apiUrl}/designation`,
            data
        );
    }
    UpdateDesignation(
        designationId: number,
        data: Partial<DesignationDTO>
    ): Observable<string> {
        return this.http.put<string>(
            `${this.apiUrl}/designation/update/${designationId}`,
            data
        );
    }
}
