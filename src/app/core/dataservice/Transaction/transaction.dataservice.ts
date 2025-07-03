import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/constants';
import { CreateTransactionBlockDTO, TransactionDTO } from './transaction.dto';

@Injectable({
    providedIn: 'root',
})
export class LetterTransactionDataService {
    apiUrl = API_URL;
    constructor(private http: HttpClient) {}

    GetPendingLetterTransactionsByStaff(
        staffId: number
    ): Observable<TransactionDTO[]> {
        return this.http.get<TransactionDTO[]>(
            `${this.apiUrl}/transaction/inbox/${staffId}`
        );
    }

    GetTransactionDetailsByLetter(
        letterId: number
    ): Observable<TransactionDTO[]> {
        return this.http.get<TransactionDTO[]>(
            `${this.apiUrl}/transaction/letter/${letterId}`
        );
    }

    //     export async function createNewLetterTransactionBlock (data) {
    //     return await axios.post(
    //         `${letterTransactionServiceApi}/api/transaction`,
    //         data
    //     )
    // }

    CreateNewTransactionBlock(
        data: CreateTransactionBlockDTO
    ): Observable<TransactionDTO> {
        return this.http.post<TransactionDTO>(
            `${this.apiUrl}/transaction`,
            data
        );
    }
}
