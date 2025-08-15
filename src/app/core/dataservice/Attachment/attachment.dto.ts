export interface AttachmentDTO {
    id?: number;
    title: string;
    fileUri: string;
    letterId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateAttachmentDTO {
    title: string;
    letterId: number;
}
