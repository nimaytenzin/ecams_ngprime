export interface FilelocationCategoryDTO {
    id: number;

    name: string;
    filelocations: FileLocationDTO[];
}

export interface FileLocationDTO {
    id: number;

    name: string;
    categoryId: number;

    category?: FilelocationCategoryDTO;
}

export interface CreateFileLocationCategoryDTO {
    name: string;
}
export interface CreateFileLocationDTO {
    name: string;
    categoryId: number;
}
