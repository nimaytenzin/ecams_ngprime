import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { CloseLetterDTO } from 'src/app/core/dataservice/Letter/letter.dto';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';

@Component({
    selector: 'app-staff-close-letter',
    templateUrl: './staff-close-letter.component.html',
    styleUrls: ['./staff-close-letter.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        InputTextareaModule,
        ButtonModule,
        FormsModule,
        ToastModule,
        DividerModule,
    ],
    providers: [DialogService, MessageService],
})
export class StaffCloseLetterComponent implements OnInit {
    letterId: number;
    remarks: string;

    constructor(
        private config: DynamicDialogConfig,
        private letterDataService: LetterDataService,
        private ref: DynamicDialogRef,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.letterId = this.config.data.letterId;
    }

    ngOnInit() {}

    closeLetter() {
        const data: CloseLetterDTO = {
            isClosed: 1,
            closingRemarks: this.remarks,
            closedBy: this.authService.GetAuthenticatedUser().id,
            closingDate: new Date().toDateString(),
        };
        this.letterDataService.UpdateLetter(this.letterId, data).subscribe({
            next: (res) => {
                if (res) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Successful',
                        detail: 'Letter successfully closed',
                        life: 3000,
                    });
                    this.ref.close({
                        status: 200,
                    });
                }
            },
        });
    }
    close() {
        this.ref.close();
    }
    //  updateLetter(this.letterId, {
    //                 isClosed: 1,
    //                 closingRemarks: this.actionTaken,
    //                 closedBy: Number(sessionStorage.getItem('userId')),
    //                 closingDate: new Date()
    //             }).then((res) => {
    //                 if (res.status === 200) {
    //                     updateTransactionBlock(this.currentBlockId, {
    //                         isClosed: 1
    //                     }).then((resp) => {
    //                         if (resp.status === 200) {
    //                             this.closeLetterModal = false

    //                             this.toast.success('Letter Closed', {
    //                                 position: POSITION.TOP_CENTER,
    //                                 toastClassName: 'my-custom-toast-class',
    //                                 bodyClassName: ['custom-class-1', 'custom-class-2']
    //                             })
    //                             this.$router.go()
    //                         } else {
    //                             this.$toast.show('Network Error', {
    //                                 position: 'top',
    //                                 type: 'error'
    //                             })
    //                         }
    //                     })
    //                 } else {
    //                     this.$toast.show('Network Error', {
    //                         position: 'top',
    //                         type: 'error'
    //                     })
    //                 }
    //             })
}
