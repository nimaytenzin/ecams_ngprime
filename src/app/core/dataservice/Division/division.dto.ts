import { DepartmentDTO } from '../Department/department.dto';
import { UserDTO } from '../User/dto/user.dto';

export interface DivisionDTO {
    id: number;
    name: string;
    abbreviation: string;
    description: string;

    staffs: UserDTO[];
    department?: DepartmentDTO;
}

export interface CreateDivisionDTO {
    name: string;
    abbreviation: string;
    description: string;
    departmentId: number;
}
