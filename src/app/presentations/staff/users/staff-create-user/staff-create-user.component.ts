import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { UserDataService } from 'src/app/core/dataservice/User/user.dataservice';
import { CreateUserDTO } from 'src/app/core/dataservice/User/dto/user.dto';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';
import { DivisionDTO } from 'src/app/core/dataservice/Division/division.dto';
import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { DivisionDataService } from 'src/app/core/dataservice/Division/division.dataservice';
import { DropdownModule } from 'primeng/dropdown';
import { DesignationDTO } from 'src/app/core/dataservice/Designation/designation.dto';
import { PositionDTO } from 'src/app/core/dataservice/Position/position.dto';
import { DesignationDataService } from 'src/app/core/dataservice/Designation/designation.dataservice';
import { PositionDataService } from 'src/app/core/dataservice/Position/position.dataservice';
import { ButtonModule } from 'primeng/button';
import { STAFFSTATUSENUM } from 'src/app/core/constants/enums';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-staff-create-user',
    templateUrl: './staff-create-user.component.html',
    styleUrls: ['./staff-create-user.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        DividerModule,
        InputTextModule,
        ReactiveFormsModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputNumberModule,
        DropdownModule,
        InputTextareaModule,
        ButtonModule,
        ToastModule,
        PasswordModule,
    ],
    providers: [MessageService],
})
export class StaffCreateUserComponent implements OnInit {
    designations: DesignationDTO[];
    positions: PositionDTO[];
    departments: DepartmentDTO[];
    divisions: DivisionDTO[];
    createUserForm: FormGroup;
    staffStatuses: string[] = Object.values(STAFFSTATUSENUM);
    isSubmitting: boolean = false;

    constructor(
        private userDataService: UserDataService,
        private fb: FormBuilder,
        private ref: DynamicDialogRef,
        private departmentDataService: DepartmentDataService,
        private divisionDataService: DivisionDataService,
        private designationDataService: DesignationDataService,
        private positionDataService: PositionDataService,
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService
    ) {
        this.createUserForm = this.fb.group(
            {
                name: ['', Validators.required],
                cid: ['', Validators.required],
                employeeId: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                contact: [
                    '',
                    [Validators.required, Validators.pattern(/^\d{8}$/)],
                ],
                address: [''],
                bio: [''],
                positionId: [null, Validators.required],
                designationId: [null, Validators.required],
                departmentId: [null, Validators.required],
                divisionId: [null, Validators.required],
                staffStatus: [STAFFSTATUSENUM.INSERVICE, Validators.required],
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', Validators.required],
            },
            { validator: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('password')?.value ===
            form.get('confirmPassword')?.value
            ? null
            : { mismatch: true };
    }

    ngOnInit() {
        this.loadFormData();
        // Set current user's department as default
        const currentUser = this.authService.GetAuthenticatedUser();
        if (currentUser?.department?.id) {
            this.createUserForm.patchValue({
                departmentId: currentUser.department.id,
            });
            this.getDivisionsByDepartment();
        }
    }

    loadFormData() {
        this.departmentDataService.GetAllDepartments().subscribe({
            next: (res) => {
                this.departments = res;
            },
        });

        this.designationDataService.GetAllDesignations().subscribe({
            next: (res) => {
                this.designations = res;
            },
        });

        this.positionDataService.GetAllPositions().subscribe({
            next: (res) => {
                this.positions = res;
            },
        });
    }

    getDivisionsByDepartment() {
        const departmentId = this.createUserForm.get('departmentId')?.value;
        if (departmentId) {
            this.divisionDataService
                .GetDivisionsByDepartment(departmentId)
                .subscribe({
                    next: (res) => {
                        this.divisions = res;
                    },
                });
        }
    }

    onDepartmentChange() {
        this.createUserForm.patchValue({ divisionId: null });
        this.divisions = [];
        this.getDivisionsByDepartment();
    }

    createUser() {
        if (this.createUserForm.valid) {
            this.isSubmitting = true;
            const formData = { ...this.createUserForm.value, role: 'staff' };

            // Keep both password and confirmPassword for backend validation
            // Remove confirmPassword from the data sent to the server
            // delete formData.confirmPassword;

            this.userDataService.CreateUser(formData).subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Staff member created successfully.',
                    });
                    this.isSubmitting = false;
                    this.ref.close(true);
                    // Navigate back to department organogram
                },
                error: (error) => {
                    console.error('Error creating user:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create staff member. Please try again.',
                    });
                    this.isSubmitting = false;
                    this.ref.close(false);
                },
            });
        } else {
            this.markFormGroupTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please fill all required fields correctly.',
            });
        }
    }

    markFormGroupTouched() {
        Object.keys(this.createUserForm.controls).forEach((key) => {
            const control = this.createUserForm.get(key);
            control?.markAsTouched();
        });
    }

    cancel() {
        this.ref.close(false);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.createUserForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldErrorMessage(fieldName: string): string {
        const field = this.createUserForm.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) {
                return `${fieldName} is required`;
            }
            if (field.errors['email']) {
                return 'Please enter a valid email address';
            }
            if (field.errors['minlength']) {
                return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
            }
            if (field.errors['pattern']) {
                return 'Please enter a valid phone number (8 digits)';
            }
        }
        if (
            fieldName === 'confirmPassword' &&
            this.createUserForm.errors?.['mismatch']
        ) {
            return 'Passwords do not match';
        }
        return '';
    }
}
