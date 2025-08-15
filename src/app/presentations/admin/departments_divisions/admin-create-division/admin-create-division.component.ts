import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DivisionDataService } from 'src/app/core/dataservice/Division/division.dataservice';
import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { CreateDivisionDTO } from 'src/app/core/dataservice/Division/division.dto';
import { DepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';

@Component({
    selector: 'app-admin-create-division',
    templateUrl: './admin-create-division.component.html',
    styleUrls: ['./admin-create-division.component.css'],
    providers: [MessageService],
})
export class AdminCreateDivisionComponent implements OnInit {
    divisionForm!: FormGroup;
    isSubmitting = false;
    departments: DepartmentDTO[] = [];
    selectedDepartment: DepartmentDTO | null = null;

    constructor(
        private fb: FormBuilder,
        private divisionService: DivisionDataService,
        private departmentService: DepartmentDataService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
        // Get department from dialog data if provided
        this.selectedDepartment = this.config.data?.department || null;
    }

    ngOnInit() {
        this.initializeForm();
        this.loadDepartments();
    }

    private initializeForm(): void {
        this.divisionForm = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ],
            ],
            abbreviation: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(10),
                ],
            ],
            description: ['', [Validators.required]],
            departmentId: [
                this.selectedDepartment?.id || '',
                [Validators.required],
            ],
        });

        // Disable department selection if department is pre-selected
        if (this.selectedDepartment) {
            this.divisionForm.get('departmentId')?.disable();
        }
    }

    private loadDepartments(): void {
        this.departmentService.GetAllDepartments().subscribe({
            next: (departments) => {
                this.departments = departments;
            },
            error: (error) => {
                console.error('Error loading departments:', error);
                this.showError('Failed to load departments');
            },
        });
    }

    onSubmit(): void {
        if (this.divisionForm.invalid) {
            this.markAllFieldsAsTouched();
            this.showError('Please fill in all required fields correctly');
            return;
        }

        this.isSubmitting = true;
        const formValue = this.divisionForm.value;

        const createDivisionData: CreateDivisionDTO = {
            name: formValue.name.trim(),
            abbreviation: formValue.abbreviation.trim().toUpperCase(),
            description: formValue.description.trim(),
            departmentId: this.selectedDepartment
                ? this.selectedDepartment.id
                : formValue.departmentId,
        };

        this.divisionService.CreateDivision(createDivisionData).subscribe({
            next: (response) => {
                this.showSuccess(
                    `Division "${response.name}" created successfully!`
                );
                this.divisionForm.reset();
                this.isSubmitting = false;

                // Close dialog and pass the created division back
                this.ref.close({
                    success: true,
                    division: response,
                    departmentId: createDivisionData.departmentId,
                });
            },
            error: (error) => {
                console.error('Error creating division:', error);
                this.isSubmitting = false;

                let errorMessage =
                    'Failed to create division. Please try again.';
                if (error.error?.message) {
                    errorMessage = error.error.message;
                } else if (error.status === 409) {
                    errorMessage =
                        'A division with this name or abbreviation already exists in this department.';
                } else if (error.status >= 500) {
                    errorMessage =
                        'Server error occurred. Please try again later.';
                }

                this.showError(errorMessage);
            },
        });
    }

    onCancel(): void {
        if (this.divisionForm.dirty) {
            if (
                confirm(
                    'You have unsaved changes. Are you sure you want to cancel?'
                )
            ) {
                this.ref.close({ success: false });
            }
        } else {
            this.ref.close({ success: false });
        }
    }

    onReset(): void {
        if (
            confirm(
                'Are you sure you want to reset the form? All entered data will be lost.'
            )
        ) {
            this.divisionForm.reset();
            this.initializeForm();
        }
    }

    private markAllFieldsAsTouched(): void {
        Object.keys(this.divisionForm.controls).forEach((key) => {
            this.divisionForm.get(key)?.markAsTouched();
        });
    }

    // Helper methods for field validation
    isFieldInvalid(fieldName: string): boolean {
        const field = this.divisionForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.divisionForm.get(fieldName);
        if (!field || !field.errors || !field.touched) return '';

        const errors = field.errors;
        if (errors['required'])
            return `${this.getFieldLabel(fieldName)} is required`;
        if (errors['minlength'])
            return `${this.getFieldLabel(fieldName)} must be at least ${
                errors['minlength'].requiredLength
            } characters`;
        if (errors['maxlength'])
            return `${this.getFieldLabel(fieldName)} cannot exceed ${
                errors['maxlength'].requiredLength
            } characters`;

        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            name: 'Division Name',
            abbreviation: 'Abbreviation',
            description: 'Description',
            departmentId: 'Department',
        };
        return labels[fieldName] || fieldName;
    }

    // Utility methods for showing messages
    private showSuccess(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 5000,
        });
    }

    private showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000,
        });
    }

    private showInfo(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: message,
            life: 3000,
        });
    }
}
