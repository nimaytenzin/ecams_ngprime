export interface FilelocationCategoryDTO {
    id: number;

    name: string;
    departmentId: number;
    filelocations: FileLocationDTO[];
}

export interface FileLocationDTO {
    id: number;

    name: string;
    categoryId: number;

    category?: FilelocationCategoryDTO;
}

export interface CreateFileLocationCategoryDTO {
    departmentId: number;
    name: string;
}
export interface CreateFileLocationDTO {
    name: string;
    categoryId: number;
}
