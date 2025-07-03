import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
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

@Component({
    selector: 'app-staff-forward-letter',
    templateUrl: './staff-forward-letter.component.html',
    styleUrls: ['./staff-forward-letter.component.css'],
    standalone: true,
    imports: [
        FormsModule,
        DropdownModule,
        CommonModule,
        ButtonModule,
        InputTextareaModule,
        DividerModule,
        ToastModule,
    ],
    providers: [DialogService, MessageService],
})
export class StaffForwardLetterComponent implements OnInit {
    letterId: number;

    departments: DepartmentDTO[] = [];
    selectedDepartment: DepartmentDTO;
    divisions: DivisionDTO[] = [];
    selectedDivision: DivisionDTO;
    staffs: UserDTO[] = [];
    selectedStaff: UserDTO;
    departmentId: number;
    divisionId: number;
    toId: number;
    remarks: string;

    form: FormGroup;

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
        this.letterId = this.config.data.letterId;
    }

    ngOnInit(): void {
        this.departmentDataService.GetAllDepartments().subscribe({
            next: (res) => {
                this.departments = res;
                this.selectedDepartment = res[0];
                this.getDivisionsByDepartment();
            },
        });
    }

    getDivisionsByDepartment() {
        this.divisionDataService
            .GetDivisionsByDepartment(this.selectedDepartment.id)
            .subscribe({
                next: (res) => {
                    this.divisions = res;
                    this.selectedDivision = res[0];
                    this.getStaffsByDivision();
                },
            });
    }

    getStaffsByDivision() {
        this.userDataService
            .GetStaffMinifiedByDivision(this.selectedDivision.id)
            .subscribe({
                next: (res) => {
                    this.staffs = res;
                },
            });
    }

    forwardLetter() {
        let data: CreateTransactionBlockDTO = {
            letterId: this.letterId,
            fromId: this.authService.GetAuthenticatedUser().id,
            toId: this.selectedStaff.id,
            remarks: this.remarks,
            type: 'FORWARD',
        };
        this.transactionDataService
            .CreateNewTransactionBlock(data)
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Successful',
                    detail: 'Letter Forwarded',
                    life: 3000,
                });
                this.ref.close({
                    status: 200,
                });
            });
    }
}
