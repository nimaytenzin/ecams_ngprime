import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { AttachmentDTO } from 'src/app/core/dataservice/Attachment/attachment.dto';

interface AttachmentModalData {
    letterId: number;
    letterReference?: string;
    letterSubject?: string;
}

@Component({
    selector: 'app-staff-attachment-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DividerModule,
        FileUploadModule,
        InputTextModule,
        ToastModule,
        TagModule,
    ],
    providers: [MessageService],
    templateUrl: './staff-attachment-modal.component.html',
    styleUrls: ['./staff-attachment-modal.component.scss'],
})
export class StaffAttachmentModalComponent implements OnInit {
    letterId: number;
    letterReference: string;
    letterSubject: string;
    attachments: AttachmentDTO[] = [];
    attachmentTitle: string = '';
    selectedFile: File | null = null;
    uploading = false;

    constructor(
        private letterService: LetterDataService,
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private messageService: MessageService
    ) {
        const data = this.config.data as AttachmentModalData;
        this.letterId = data.letterId;
        this.letterReference = data.letterReference || '';
        this.letterSubject = data.letterSubject || '';
    }

    ngOnInit(): void {
        this.loadAttachments();
    }

    loadAttachments(): void {
        this.letterService.GetAttachmentsByLetter(this.letterId).subscribe({
            next: (attachments) => {
                this.attachments = attachments;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load attachments',
                });
            },
        });
    }

    onFileSelect(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    onUploadAttachment(): void {
        if (!this.attachmentTitle.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter attachment title',
            });
            return;
        }

        if (!this.selectedFile) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a file',
            });
            return;
        }

        this.uploading = true;
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('title', this.attachmentTitle);
        formData.append('letterId', this.letterId.toString());

        this.letterService.UploadAttachment(formData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Attachment uploaded successfully',
                });
                this.attachmentTitle = '';
                this.selectedFile = null;
                this.uploading = false;
                this.loadAttachments();

                // Reset file input
                const fileInput = document.getElementById(
                    'attachmentFile'
                ) as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to upload attachment',
                });
                this.uploading = false;
            },
        });
    }

    onRemoveAttachment(attachmentId: number): void {
        // This would require a delete endpoint
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Remove attachment functionality needs to be implemented',
        });
    }

    onProceed(): void {
        this.ref.close({
            success: true,
            attachmentCount: this.attachments.length,
        });
    }

    onSkip(): void {
        this.ref.close({
            success: true,
            attachmentCount: 0,
            skipped: true,
        });
    }

    onCancel(): void {
        this.ref.close({ success: false });
    }

    triggerFileInput(): void {
        const fileInput = document.getElementById(
            'attachmentFile'
        ) as HTMLInputElement;
        fileInput?.click();
    }
}
