import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { DepartmentDTO } from '../Department/department.dto';
import { FilelocationCategoryDTO, FileLocationDTO } from './folder.storage.dto';

@Injectable({
    providedIn: 'root',
})
export class FolderStorageDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}
    //     export async function getAllFileLocationCategories () {
    //     return await axios.get(`${efilingServiceApi}/api/filelocation-category`)
    // }

    // export async function getAllFileLocationsByCategory (categoryId) {
    //     return await axios.get(
    //         `${efilingServiceApi}/api/filelocations/category/${categoryId}`
    //     )
    // }

    GetAllFileLocationCategories(): Observable<FilelocationCategoryDTO[]> {
        return this.http.get<FilelocationCategoryDTO[]>(
            `${this.apiUrl}/filelocation-category`
        );
    }

    GetAllFileLocationsByCategory(
        categoryId: number
    ): Observable<FileLocationDTO[]> {
        return this.http.get<FileLocationDTO[]>(
            `${this.apiUrl}/filelocations/category/${categoryId}`
        );
    }
}
