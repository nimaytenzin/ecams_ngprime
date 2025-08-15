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
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';

import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { DepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';
import { DivisionDataService } from 'src/app/core/dataservice/Division/division.dataservice';
import { DivisionDTO } from 'src/app/core/dataservice/Division/division.dto';
import { LetterTransactionDataService } from 'src/app/core/dataservice/Transaction/transaction.dataservice';
import { CreateTransactionBlockDTO } from 'src/app/core/dataservice/Transaction/transaction.dto';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { UserDTO } from 'src/app/core/dataservice/User/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/User/user.dataservice';

interface ForwardLetterData {
    letterId: number;
}

@Component({
    selector: 'app-staff-forward-letter-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DropdownModule,
        DividerModule,
        InputTextareaModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './staff-forward-letter-modal.component.html',
    styleUrls: ['./staff-forward-letter-modal.component.scss'],
})
export class StaffForwardLetterModalComponent implements OnInit {
    letterId: number;

    departments: DepartmentDTO[] = [];
    selectedDepartment: DepartmentDTO;
    divisions: DivisionDTO[] = [];
    selectedDivision: DivisionDTO;
    staffs: UserDTO[] = [];
    selectedStaff: UserDTO;
    remarks: string;

    constructor(
        private departmentDataService: DepartmentDataService,
        private divisionDataService: DivisionDataService,
        private userDataService: UserDataService,
        private transactionDataService: LetterTransactionDataService,
        private config: DynamicDialogConfig,
        private authService: AuthService,
        private ref: DynamicDialogRef,
        private messageService: MessageService
    ) {
        this.letterId = this.config.data?.letterId;
    }

    ngOnInit(): void {
        this.departmentDataService.GetAllDepartments().subscribe({
            next: (res) => {
                this.departments = res;
                if (res.length > 0) {
                    this.selectedDepartment = res[0];
                    this.getDivisionsByDepartment();
                }
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load departments',
                });
            },
        });
    }

    getDivisionsByDepartment() {
        if (!this.selectedDepartment) return;

        this.divisionDataService
            .GetDivisionsByDepartment(this.selectedDepartment.id)
            .subscribe({
                next: (res) => {
                    this.divisions = res;
                    if (res.length > 0) {
                        this.selectedDivision = res[0];
                        this.getStaffsByDivision();
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load divisions',
                    });
                },
            });
    }

    getStaffsByDivision() {
        if (!this.selectedDivision) return;

        this.userDataService
            .GetStaffMinifiedByDivision(this.selectedDivision.id)
            .subscribe({
                next: (res) => {
                    this.staffs = res;
                    this.selectedStaff = null;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load staff members',
                    });
                },
            });
    }

    forwardLetter() {
        if (!this.selectedStaff) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select a staff member to forward to',
            });
            return;
        }

        let data: CreateTransactionBlockDTO = {
            letterId: this.letterId,
            fromId: this.authService.GetAuthenticatedUser().id,
            toId: this.selectedStaff.id,
            remarks: this.remarks,
            type: 'FORWARD',
        };

        this.transactionDataService.CreateNewTransactionBlock(data).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Letter forwarded successfully',
                });
                this.ref.close({
                    success: true,
                    data: res,
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to forward letter',
                });
            },
        });
    }

    onCancel(): void {
        this.ref.close({ success: false });
    }
}
