import { DivisionDTO } from '../Division/division.dto';

export interface DepartmentDTO {
    id: number;
    name: string;
    abbreviation: string;
    description: string;
    vision: string;
    mission: string;

    divisions: DivisionDTO[];
}
