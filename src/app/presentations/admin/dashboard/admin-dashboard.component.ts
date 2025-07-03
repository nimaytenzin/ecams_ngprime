import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { MeterGroupModule } from 'primeng/metergroup';
import { TabViewModule } from 'primeng/tabview';
import { AuthenticatedUserDTO } from 'src/app/core/dataservice/User/dto/auth.dto';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { LetterDTO } from 'src/app/core/dataservice/Letter/letter.dto';
import { TransactionDTO } from 'src/app/core/dataservice/Transaction/transaction.dto';
import { LetterTransactionDataService } from 'src/app/core/dataservice/Transaction/transaction.dataservice';
@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.scss'],
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
    ],
    providers: [DialogService],
})
export class AdminDashboardComponent implements OnInit {
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
        this.router.navigate(['admin/letter', letter.id]);
    }
}
