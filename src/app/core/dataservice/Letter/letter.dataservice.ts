// /letter/pending/staff/${staffId}`

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_URL } from '../../constants/constants';
import {
    AUTH_TOKEN_KEY,
    CURRENT_ROLE_KEY,
} from '../../constants/api-constants';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CreateLetterDTO, LetterDTO } from './letter.dto';
import { PaginatedData, PaginatedParamsOptions } from '../paginated-data.dto';

@Injectable({
    providedIn: 'root',
})
export class LetterDataService {
    apiUrl = API_URL;
    authTokenKey = AUTH_TOKEN_KEY;
    currentRoleKey = CURRENT_ROLE_KEY;

    constructor(private http: HttpClient, private router: Router) {}

    GetLatest12Letters(): Observable<LetterDTO[]> {
        return this.http.get<LetterDTO[]>(`${this.apiUrl}/letter/latest/12`);
    }

    GetAllPendingLetterByStaff(staffId: number): Observable<LetterDTO[]> {
        return this.http.get<LetterDTO[]>(
            `${this.apiUrl}/letter/pending/staff/${staffId}`
        );
    }
    GetLetterDetailsById(letterId: number): Observable<LetterDTO> {
        return this.http.get<LetterDTO>(`${this.apiUrl}/letter/${letterId}`);
    }

    CreateNewLetter(data: CreateLetterDTO): Observable<LetterDTO> {
        return this.http.post<LetterDTO>(`${this.apiUrl}/letter`, data);
    }
    UploadNewLetter(data: CreateLetterDTO): Observable<LetterDTO> {
        return this.http.post<LetterDTO>(`${this.apiUrl}/letter`, data);
    }

    UpdateLetter(
        letterId: number,
        data: Partial<LetterDTO>
    ): Observable<LetterDTO> {
        return this.http.put<LetterDTO>(
            `${this.apiUrl}/letter/update/${letterId}`,
            data
        );
    }

    FuzzySearchLetters(searchText: string): Observable<LetterDTO[]> {
        return this.http.get<LetterDTO[]>(
            `${this.apiUrl}/letter/fuzzySearch/${searchText}`
        );
    }

    // GetAllUnitLeaseByAdminPaginated(
    //     adminId: number,
    //     params?: PaginatedParamsOptions
    // ): Observable<PaginatedData<LeaseAgreeementDTO>> {
    //     let httpParams = new HttpParams();
    //     if (params) {
    //         if (params.pageNo !== undefined) {
    //             httpParams = httpParams.append(
    //                 'pageNo',
    //                 params.pageNo.toString()
    //             );
    //         }
    //         if (params.pageSize !== undefined) {
    //             httpParams = httpParams.append(
    //                 'pageSize',
    //                 params.pageSize.toString()
    //             );
    //         }
    //     }

    //     return this.http.get<PaginatedData<LeaseAgreeementDTO>>(
    //         `${this.apiUrl}/lease-agreement/admin/unit/p/${adminId}`,
    //         { params: httpParams }
    //     );
    // }

    GetAllLettersByDepartmentPaginated(
        departmentId: number,
        params?: PaginatedParamsOptions
    ) {
        let httpParams = new HttpParams();
        if (params) {
            if (params.pageNo !== undefined) {
                httpParams = httpParams.append(
                    'pageNo',
                    params.pageNo.toString()
                );
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.append(
                    'pageSize',
                    params.pageSize.toString()
                );
            }
        }
        return this.http.get<PaginatedData<LetterDTO>>(
            `${this.apiUrl}/letter/all/p/${departmentId}`,
            { params: httpParams }
        );
    }

    GetAllPendingLettersByDepartmentPaginated(
        departmentId: number,
        params?: PaginatedParamsOptions
    ) {
        let httpParams = new HttpParams();
        if (params) {
            if (params.pageNo !== undefined) {
                httpParams = httpParams.append(
                    'pageNo',
                    params.pageNo.toString()
                );
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.append(
                    'pageSize',
                    params.pageSize.toString()
                );
            }
        }
        return this.http.get<PaginatedData<LetterDTO>>(
            `${this.apiUrl}/letter/pending/p/${departmentId}`,
            { params: httpParams }
        );
    }

    GetAllResolvedLettersByDepartmentPaginated(
        departmentId: number,
        params?: PaginatedParamsOptions
    ) {
        let httpParams = new HttpParams();
        if (params) {
            if (params.pageNo !== undefined) {
                httpParams = httpParams.append(
                    'pageNo',
                    params.pageNo.toString()
                );
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.append(
                    'pageSize',
                    params.pageSize.toString()
                );
            }
        }
        return this.http.get<PaginatedData<LetterDTO>>(
            `${this.apiUrl}/letter/resolved/p/${departmentId}`,
            { params: httpParams }
        );
    }
}
