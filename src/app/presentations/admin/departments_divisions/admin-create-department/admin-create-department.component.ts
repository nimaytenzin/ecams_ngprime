import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { CreateDepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';

@Component({
    selector: 'app-admin-create-department',
    templateUrl: './admin-create-department.component.html',
    styleUrls: ['./admin-create-department.component.css'],
    providers: [MessageService],
})
export class AdminCreateDepartmentComponent implements OnInit {
    departmentForm!: FormGroup;
    isLoading = false;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private departmentService: DepartmentDataService,
        private messageService: MessageService,
        private router: Router,
        private ref: DynamicDialogRef
    ) {}

    ngOnInit() {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.departmentForm = this.fb.group({
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
            description: [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(500),
                ],
            ],
            vision: [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(1000),
                ],
            ],
            mission: [
                '',
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(1000),
                ],
            ],
        });
    }

    onSubmit(): void {
        if (this.departmentForm.invalid) {
            this.markAllFieldsAsTouched();
            this.showError('Please fill in all required fields correctly');
            return;
        }

        this.isSubmitting = true;
        const formValue = this.departmentForm.value;

        const createDepartmentData: CreateDepartmentDTO = {
            name: formValue.name.trim(),
            abbreviation: formValue.abbreviation.trim().toUpperCase(),
            description: formValue.description.trim(),
            vision: formValue.vision.trim(),
            mission: formValue.mission.trim(),
        };

        this.departmentService
            .CreateDepartment(createDepartmentData)
            .subscribe({
                next: (response) => {
                    this.showSuccess(
                        `Department "${response.name}" created successfully!`
                    );
                    this.departmentForm.reset();
                    this.isSubmitting = false;

                    // Close dialog and pass the created department back
                    this.ref.close({
                        success: true,
                        department: response,
                    });
                },
                error: (error) => {
                    console.error('Error creating department:', error);
                    this.isSubmitting = false;

                    let errorMessage =
                        'Failed to create department. Please try again.';
                    if (error.error?.message) {
                        errorMessage = error.error.message;
                    } else if (error.status === 409) {
                        errorMessage =
                            'A department with this name or abbreviation already exists.';
                    } else if (error.status >= 500) {
                        errorMessage =
                            'Server error occurred. Please try again later.';
                    }

                    this.showError(errorMessage);
                },
            });
    }

    onCancel(): void {
        if (this.departmentForm.dirty) {
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
            this.departmentForm.reset();
            this.initializeForm();
        }
    }

    private markAllFieldsAsTouched(): void {
        Object.keys(this.departmentForm.controls).forEach((key) => {
            this.departmentForm.get(key)?.markAsTouched();
        });
    }

    // Helper methods for field validation
    isFieldInvalid(fieldName: string): boolean {
        const field = this.departmentForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.departmentForm.get(fieldName);
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
            name: 'Department Name',
            abbreviation: 'Abbreviation',
            description: 'Description',
            vision: 'Vision',
            mission: 'Mission',
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
