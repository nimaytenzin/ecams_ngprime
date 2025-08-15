export interface PositionDTO {
    id: number;
    name: string;
    category: string;
    hierarchical_level: number;
}

export interface CreatePositionDTO {
    name: string;
    category: string;
    hierarchical_level: number;
}
