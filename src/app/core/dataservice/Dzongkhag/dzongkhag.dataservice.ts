import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { DepartmentDTO } from '../Department/department.dto';
import { DzongkhagDTO } from './dzongkhag.dto';

@Injectable({
    providedIn: 'root',
})
export class DzongkhagDataService {
    apiUrl = API_URL;

    dzongkhags: DzongkhagDTO[] = [
        { name: 'Thimphu' },
        { name: 'Bumthang' },
        { name: 'Chhukha' },
        { name: 'Dagana' },
        { name: 'Gasa' },
        { name: 'Haa' },
        { name: 'Lhuentse' },
        { name: 'Mongar' },
        { name: 'Paro' },
        { name: 'PemaGatshel' },
        { name: 'Punakha' },
        { name: 'SamdrupJongkhar' },
        { name: 'Samtse' },
        { name: 'Sarpang' },
        { name: 'Trashigang' },
        { name: 'TrashiYangtse' },
        { name: 'Trongsa' },
        { name: 'Tsirang' },
        { name: 'WangduePhodrang' },
        { name: 'Zhemgang' },
    ];
}
