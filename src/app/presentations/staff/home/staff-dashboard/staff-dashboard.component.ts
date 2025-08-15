import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GalleriaModule } from 'primeng/galleria';
import { MeterGroupModule } from 'primeng/metergroup';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { LetterDTO } from 'src/app/core/dataservice/Letter/letter.dto';
import { LetterTransactionDataService } from 'src/app/core/dataservice/Transaction/transaction.dataservice';
import { TransactionDTO } from 'src/app/core/dataservice/Transaction/transaction.dto';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { AuthenticatedUserDTO } from 'src/app/core/dataservice/User/dto/auth.dto';

@Component({
    selector: 'app-staff-dashboard',
    templateUrl: './staff-dashboard.component.html',
    styleUrls: ['./staff-dashboard.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        GalleriaModule,
        MeterGroupModule,
        DividerModule,
        TabViewModule,
        ProgressBarModule,
        TooltipModule,
        TagModule,
    ],
    providers: [DialogService],
})
export class StaffDashboardComponent implements OnInit {
    ref: DynamicDialogRef;

    authenticatedUser: AuthenticatedUserDTO;

    pendingLetters: LetterDTO[] = [];
    pendingLetterTransactions: TransactionDTO[] = [];
    latestLetters: LetterDTO[] = [];

    constructor(
        private dialogService: DialogService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private router: Router,
        private letterDataService: LetterDataService,
        private letterTransactionDataService: LetterTransactionDataService
    ) {}

    ngOnInit() {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();
        this.letterDataService
            .GetAllPendingLetterByStaff(this.authenticatedUser.id)
            .subscribe({
                next: (res) => {
                    this.pendingLetters = res;
                },
            });
        this.letterTransactionDataService
            .GetPendingLetterTransactionsByStaff(this.authenticatedUser.id)
            .subscribe({
                next: (res) => {
                    this.pendingLetterTransactions = res;
                },
            });
        this.letterDataService
            .GetLatest12Letters(this.authenticatedUser.department.id)
            .subscribe({
                next: (res) => {
                    this.latestLetters = res;
                    console.log(this.latestLetters);
                },
            });
    }

    getPaymentsSummary() {}

    getDaysElapsed(date) {
        const diff = Math.round((Date.now() - Date.parse(date)) / 86400000);
        if (diff === 1) {
            return 1;
        } else {
            return diff;
        }
    }

    goToViewLetter(letter: LetterDTO) {
        this.router.navigate(['/staff/letter/view', letter.id]);
    }
}
