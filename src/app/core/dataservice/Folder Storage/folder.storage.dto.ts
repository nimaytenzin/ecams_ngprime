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
