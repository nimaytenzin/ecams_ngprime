import { UserDTO } from '../User/dto/user.dto';

export interface DivisionDTO {
    id: number;
    name: string;
    abbreviation: string;
    description: string;

    staffs: UserDTO[];
}
