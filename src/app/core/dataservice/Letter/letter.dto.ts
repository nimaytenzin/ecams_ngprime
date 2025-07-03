import { DepartmentDTO } from '../Department/department.dto';
import { DivisionDTO } from '../Division/division.dto';
import { UserDTO } from '../User/dto/user.dto';

export interface LetterDTO {
    id: number;
    direction: string;
    subject: string;
    letterHead: string;

    outRecipient: string;
    outLetterHead: string;
    outOffice: string;
    outDepartment: string;
    outDivision: string;
    outDzongkhag: string;

    parentLetterId: number;
    childLetterId: number;
    creatorId: number;
    archivalFolderId: number;
    archivalFolderCategoryId: number;
    year: number;
    isDraft: number;
    isClosed: number;
    tags: string;
    fileUri: string;
    dealerId: number;
    closedBy: number;
    closingRemarks: string;
    closingDate: string;

    departmentId: number;
    divisionId: number;

    department: DepartmentDTO;
    division: DivisionDTO;
    currentDealingOfficer: UserDTO;
    closer: UserDTO;

    createdAt: string;
}

export interface CreateLetterDTO {
    creatorId: number;

    direction: string;
    subject: string;
    letterHead: string;

    outRecipient: string;
    outLetterHead: string;
    outOffice: string;
    outDepartment: string;
    outDivision: string;
    outDzongkhag: string;

    departmentId: number;
    divisionId: number;

    parentLetterId?: number;
    childLetterId?: number;

    archivalFolderId: number;
    archivalFolderCategoryId: number;

    isDraft: number;
    isClosed: number;
}

export interface CloseLetterDTO {
    isClosed: number;
    closingRemarks: string;
    closedBy: number;
    closingDate: string;
}
