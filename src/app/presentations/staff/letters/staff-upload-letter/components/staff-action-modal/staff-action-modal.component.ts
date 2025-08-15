import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

interface ActionModalData {
    letterId: number;
    letterSubject?: string;
    letterReference?: string;
}

@Component({
    selector: 'app-staff-action-modal',
    standalone: true,
    imports: [CommonModule, ButtonModule, DividerModule, ToastModule],
    providers: [MessageService],
    templateUrl: './staff-action-modal.component.html',
    styleUrls: ['./staff-action-modal.component.scss'],
})
export class StaffActionModalComponent implements OnInit {
    letterId: number;
    letterSubject: string;
    letterReference: string;

    constructor(
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private messageService: MessageService
    ) {
        const data = this.config.data as ActionModalData;
        this.letterId = data.letterId;
        this.letterSubject = data.letterSubject || '';
        this.letterReference = data.letterReference || '';
    }

    ngOnInit(): void {
        // Component initialized
    }

    onForwardLetter(): void {
        this.ref.close({
            action: 'forward',
            letterId: this.letterId,
        });
    }

    onCloseLetter(): void {
        this.ref.close({
            action: 'close',
            letterId: this.letterId,
        });
    }

    onSkip(): void {
        this.ref.close({
            action: 'skip',
            letterId: this.letterId,
        });
    }
}
