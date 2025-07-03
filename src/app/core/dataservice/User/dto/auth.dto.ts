import { USERROLESENUM } from 'src/app/core/constants/enums';
import { PositionDTO } from '../../Position/position.dto';
import { DesignationDTO } from '../../Designation/designation.dto';
import { DepartmentDTO } from '../../Department/department.dto';
import { DivisionDTO } from '../../Division/division.dto';

export interface RequestPasswordResetDto {
    phoneNumber: number;
}

export interface UpdateUserPhoneNumber {
    newPhoneNumber: number;
    adminId: number;
}

export interface AuthenticatedUserDTO {
    id: number;
    role: string;
    name: string;
    position: PositionDTO;
    designation: DesignationDTO;
    department: DepartmentDTO;
    division: DivisionDTO;
    profileUri: string;
    exp: number;
    iat: number;
}
export interface CurrentRoleDTO {
    name: string;
}
export interface UpdatePinDto {
    userAuthId: number;
    pin: string;
}

export interface ResetPinDto {
    userAuthId: number;
}

export interface UpdatePasswordDTO {
    userId: number;

    newPassword: string;

    newPasswordRentry: string;

    role: string;
    adminId: number;
}
