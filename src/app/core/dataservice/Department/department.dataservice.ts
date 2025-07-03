// export async function getDivisionByDepartment(id) {
//     return await axios.get(
//         `${efilingServiceApi}/api/divisions/department/${id}`
//     );
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { DepartmentDTO } from './department.dto';

@Injectable({
    providedIn: 'root',
})
export class DepartmentDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}

    GetDepartmentOrganogram(departmentId: number): Observable<DepartmentDTO> {
        return this.http.get<DepartmentDTO>(
            `${this.apiUrl}/departments/organogram/${departmentId}`
        );
    }

    GetAllDepartments(): Observable<DepartmentDTO[]> {
        return this.http.get<DepartmentDTO[]>(`${this.apiUrl}/departments`);
    }
}
