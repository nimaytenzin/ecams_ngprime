export interface UserDTO {
    id: number;
    name: string;
    email: string;
    contact: number;
    employeeId: number;
    cid: string;
    officeExtensionNumber: string;
    address: string;
    role: string;
    staffStatus: string;
    bio: string;
    telegramId: string;
    password: string;
    profileUri: string;
    signatureUri: string;
    positionId: number;
    designationId: number;
    departmentId: number;
    divisionId: number;
    isActive: boolean;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    contact?: number;
    employeeId?: number;
    cid?: string;
    officeExtensionNumber?: string;
    address?: string;
    role?: string;
    staffStatus?: string;
    bio?: string;
    telegramId?: string;
    positionId?: number;
    designationId?: number;
    departmentId?: number;
    divisionId?: number;
}

export interface UpdateUserDetailsDTO {}

export interface ChangePasswordDTO {
    newPassword: string;
    confirmPassword: string;
}
