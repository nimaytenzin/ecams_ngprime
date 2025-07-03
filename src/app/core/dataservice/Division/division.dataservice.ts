// export async function getDivisionByDepartment(id) {
//     return await axios.get(
//         `${efilingServiceApi}/api/divisions/department/${id}`
//     );
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { DivisionDTO } from './division.dto';
import { DepartmentDTO } from '../Department/department.dto';

@Injectable({
    providedIn: 'root',
})
export class DivisionDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}

    GetDivisionsByDepartment(departmentId: number): Observable<DivisionDTO[]> {
        return this.http.get<DivisionDTO[]>(
            `${this.apiUrl}/divisions/department/${departmentId}`
        );
    }
}
