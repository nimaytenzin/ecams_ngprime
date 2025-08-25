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

    GetLatest12Letters(departmentId: number): Observable<LetterDTO[]> {
        return this.http.get<LetterDTO[]>(
            `${this.apiUrl}/letter/latest/12/${departmentId}`
        );
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

    AddNewLetter(data: CreateLetterDTO): Observable<LetterDTO> {
        return this.http.post<LetterDTO>(`${this.apiUrl}/letter`, data);
    }

    UploadLetterToArchive(
        department: string,
        division: string,
        folderName: string,
        year: number,
        letterId: number,
        formData: FormData
    ): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/letter/store-letter/${department}/${division}/${folderName}/${year}/${letterId}`,
            formData
        );
    }

    UploadLetterFile(letterId: number, formData: FormData): Observable<any> {
        return this.http.put(
            `${this.apiUrl}/letter/upload/${letterId}`,
            formData
        );
    }

    UploadAttachment(data: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/attachments`, data);
    }

    GetAttachmentsByLetter(letterId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.apiUrl}/attachments/letterId/${letterId}`
        );
    }

    GetLettersForArchive(
        year: number,
        divisionId: number,
        fileLocationId: number
    ): Observable<LetterDTO[]> {
        return this.http.get<LetterDTO[]>(
            `${this.apiUrl}/letter/archive/${year}/${divisionId}/${fileLocationId}`
        );
    }
}
