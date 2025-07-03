import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TabViewModule } from 'primeng/tabview';
import { ASSET_URL } from 'src/app/core/constants/constants';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { LetterDTO } from 'src/app/core/dataservice/Letter/letter.dto';
import { LetterTransactionDataService } from 'src/app/core/dataservice/Transaction/transaction.dataservice';
import { TransactionDTO } from 'src/app/core/dataservice/Transaction/transaction.dto';
import { StaffForwardLetterComponent } from '../components/staff-forward-letter/staff-forward-letter.component';
import { TagModule } from 'primeng/tag';
import { StaffCloseLetterComponent } from '../components/staff-close-letter/staff-close-letter.component';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';

@Component({
    selector: 'app-staff-view-letter',
    templateUrl: './staff-view-letter.component.html',
    styleUrls: ['./staff-view-letter.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        PdfViewerModule,
        TabViewModule,
        DividerModule,
        TagModule,
    ],
    providers: [DialogService, MessageService],
})
export class StaffViewLetterComponent implements OnInit {
    showPdfLoading: boolean = true;

    letterId: number;
    letterDetails: LetterDTO;
    letterUri: string;
    parentTranscationBlocks: TransactionDTO[] = [];
    activeTab: 'details' | 'transactions' = 'details';
    // Permissions
    letterForwardAuthority = false;

    // Modals
    ref: DynamicDialogRef;
    isCurrentDealingOfficial: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private letterService: LetterDataService,
        private letterTransactionService: LetterTransactionDataService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private authService: AuthService
    ) {
        this.letterId = Number(this.route.snapshot.paramMap.get('letterId'));
    }

    ngOnInit(): void {
        this.loadLetterDetails();
        this.loadTransactionBlocks();
    }

    loadLetterDetails(): void {
        this.letterService.GetLetterDetailsById(this.letterId).subscribe({
            next: (res) => {
                this.letterDetails = res;
                this.letterUri = `${ASSET_URL}/${this.letterDetails.fileUri}`;
                this.isCurrentDealingOfficial =
                    this.authService.GetAuthenticatedUser().id ===
                    this.letterDetails.dealerId;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load letter details',
                });
            },
        });
    }

    pdfLoaded() {
        this.showPdfLoading = false;
    }

    loadTransactionBlocks(): void {
        this.letterTransactionService
            .GetTransactionDetailsByLetter(this.letterId)
            .subscribe({
                next: (res) => {
                    console.log('PARENT TRANSACTION BLOCK', res);
                    this.parentTranscationBlocks = res;
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load transaction history',
                    });
                },
            });
    }

    openCloseLetterModal(): void {
        this.ref = this.dialogService.open(StaffCloseLetterComponent, {
            header: 'Close Letter',
            baseZIndex: 10000,
            data: {
                letterId: this.letterId,
                currentBlockId: Number(sessionStorage.getItem('blockId')),
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.loadLetterDetails();
                this.loadTransactionBlocks();
            }
        });
    }

    openForwardLetterModal(): void {
        this.ref = this.dialogService.open(StaffForwardLetterComponent, {
            header: 'Forward Letter',
            baseZIndex: 10000,
            data: {
                letterId: this.letterId,
            },
        });
        this.ref.onClose.subscribe((res) => {
            if (res && res.status === 200) {
                this.loadLetterDetails();
                this.loadTransactionBlocks();
            }
        });
    }

    openDraftResponseModal(): void {}

    showMessageModal(block: any): void {
        // this.ref = this.dialogService.open(MessageModalComponent, {
        //     width: '500px',
        //     contentStyle: { 'max-height': '500px', overflow: 'auto' },
        //     baseZIndex: 10000,
        //     data: {
        //         messageBlock: block,
        //     },
        // });
    }

    getDaysElapsed(date: string): number {
        return Math.round(
            (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
        );
    }

    getTaT(letter: any): string {
        if (!letter.closingDate) return 'Closing Date not Reflected';

        const diff = Math.round(
            (new Date(letter.createdAt).getTime() -
                new Date(letter.closingDate).getTime()) /
                (1000 * 60 * 60 * 24)
        );

        return diff === 1 || diff === 0 ? '1 day' : `${diff} days`;
    }

    processAttachmentUrl(uri: string) {
        // return `${environment.letterServiceApi}/${uri}`;
    }

    getStaffImgUrl(pic: string): any {
        return {
            'background-image': `url("${ASSET_URL}/${pic}")`,
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
            width: '2rem',
            height: '2rem',
        };
    }

    getProfileUri(uri: string): string {
        return `url("${ASSET_URL}/${uri}")`;
    }

    downloadLetterPdf() {}
}
