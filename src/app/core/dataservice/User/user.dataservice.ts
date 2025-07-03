import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../constants/constants';
import { Observable } from 'rxjs';
import { CreateUserDTO, UpdateUserDetailsDTO, UserDTO } from './dto/user.dto';
import { PaginatedParamsOptions, PaginatedData } from '../paginated-data.dto';

@Injectable({
    providedIn: 'root',
})
export class UserDataService {
    apiUrl = API_URL;

    constructor(private http: HttpClient) {}

    CreateUser(data: CreateUserDTO): Observable<UserDTO> {
        return this.http.post<UserDTO>(`${this.apiUrl}/auth/register`, data);
    }

    GetStaffMinifiedByDivision(divisionId: number): Observable<UserDTO[]> {
        return this.http.get<UserDTO[]>(
            `${this.apiUrl}/user/staffdivision/${divisionId}`
        );
    }

    GetUserDetails(userId: number): Observable<UserDTO> {
        return this.http.get<UserDTO>(`${this.apiUrl}/user/detail/${userId}`);
    }

    UpdateUserDetails(userId: number, data: UserDTO) {
        return this.http.put<UserDTO>(`${this.apiUrl}/user/${userId}`, data);
    }

    UploadProfile(userId: number, data: any) {
        return this.http.put<UserDTO>(
            `${this.apiUrl}/user/${userId}/uploadProfile`,
            data
        );
    }
    //     export async function getUserDetails (id) {
    //     return await axios.get(`${efilingServiceApi}/api/user/detail/${id}`)
    // }

    //     export async function getMinifiedStaffByDivision (divId) {
    //     return await axios.get(
    //         `${efilingServiceApi}/api/user/staffdivision/${divId}`
    //     )
    // }
}
