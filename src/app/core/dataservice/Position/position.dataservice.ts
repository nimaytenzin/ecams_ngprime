// export async function getDivisionByDepartment(id) {
//     return await axios.get(
//         `${efilingServiceApi}/api/divisions/department/${id}`
//     );
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { PositionDTO } from './position.dto';

@Injectable({
    providedIn: 'root',
})
export class PositionDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}

    GetAllPositions(): Observable<PositionDTO[]> {
        return this.http.get<PositionDTO[]>(`${this.apiUrl}/position`);
    }
}
