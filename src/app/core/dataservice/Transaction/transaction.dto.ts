import { LetterDTO } from '../Letter/letter.dto';

export interface TransactionDTO {
    letterId: string;
    fromId: string;
    toId: string;
    remarks: string;
    type: string;

    letter?: LetterDTO;
}

export interface CreateTransactionBlockDTO {
    letterId: number;
    fromId: number;
    toId: number;
    remarks: string;
    type: string;
}
