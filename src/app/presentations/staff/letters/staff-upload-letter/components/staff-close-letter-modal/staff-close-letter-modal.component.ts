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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';

import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';

interface CloseLetterData {
    letterId: number;
    letterSubject?: string;
    letterReference?: string;
}

@Component({
    selector: 'app-staff-close-letter-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DividerModule,
        InputTextareaModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './staff-close-letter-modal.component.html',
    styleUrls: ['./staff-close-letter-modal.component.scss'],
})
export class StaffCloseLetterModalComponent implements OnInit {
    letterId: number;
    letterSubject: string;
    letterReference: string;
    closingRemarks: string = '';
    closing = false;

    constructor(
        private letterService: LetterDataService,
        private config: DynamicDialogConfig,
        private authService: AuthService,
        private ref: DynamicDialogRef,
        private messageService: MessageService
    ) {
        const data = this.config.data as CloseLetterData;
        this.letterId = data.letterId;
        this.letterSubject = data.letterSubject || '';
        this.letterReference = data.letterReference || '';
    }

    ngOnInit(): void {
        // Component initialized
    }

    closeLetter(): void {
        if (!this.closingRemarks.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter closing remarks',
            });
            return;
        }

        this.closing = true;

        const updateData = {
            isClosed: 1,
            closedBy: this.authService.GetAuthenticatedUser().id,
            closingRemarks: this.closingRemarks.trim(),
            closingDate: new Date().toISOString(),
        };

        this.letterService.UpdateLetter(this.letterId, updateData).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Letter closed successfully',
                });
                this.ref.close({
                    success: true,
                    data: response,
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to close letter',
                });
                this.closing = false;
            },
        });
    }

    onCancel(): void {
        this.ref.close({ success: false });
    }
}
