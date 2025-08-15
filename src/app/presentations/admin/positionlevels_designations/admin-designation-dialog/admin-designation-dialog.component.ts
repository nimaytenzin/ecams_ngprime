import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DesignationDataService } from 'src/app/core/dataservice/Designation/designation.dataservice';
import {
    DesignationDTO,
    CreateDesignationDTO,
} from 'src/app/core/dataservice/Designation/designation.dto';

@Component({
    selector: 'app-admin-designation-dialog',
    templateUrl: './admin-designation-dialog.component.html',
    styleUrls: ['./admin-designation-dialog.component.css'],
    providers: [MessageService],
})
export class AdminDesignationDialogComponent implements OnInit {
    designationForm!: FormGroup;
    isSubmitting = false;
    isEditMode = false;
    designation: DesignationDTO | null = null;

    constructor(
        private fb: FormBuilder,
        private designationService: DesignationDataService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
        this.designation = this.config.data?.designation || null;
        this.isEditMode = !!this.designation;
    }

    ngOnInit() {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.designationForm = this.fb.group({
            name: [
                this.designation?.name || '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
            ],
        });
    }

    onSubmit(): void {
        if (this.designationForm.invalid) {
            this.markAllFieldsAsTouched();
            this.showError('Please fill in all required fields correctly');
            return;
        }

        this.isSubmitting = true;
        const formValue = this.designationForm.value;

        if (this.isEditMode && this.designation) {
            // Update existing designation
            const updateData: Partial<DesignationDTO> = {
                name: formValue.name.trim(),
            };

            this.designationService
                .UpdateDesignation(this.designation.id, updateData)
                .subscribe({
                    next: (response) => {
                        this.showSuccess(
                            response || 'Designation updated successfully!'
                        );
                        // Return the updated designation data
                        const updatedDesignation: DesignationDTO = {
                            ...this.designation!,
                            ...updateData,
                        };
                        this.ref.close({
                            success: true,
                            designation: updatedDesignation,
                            action: 'update',
                        });
                    },
                    error: (error) => this.handleError(error, 'update'),
                });
        } else {
            // Create new designation
            const createData: CreateDesignationDTO = {
                name: formValue.name.trim(),
            };

            this.designationService.CreateNewDesignation(createData).subscribe({
                next: (response) => {
                    this.showSuccess(
                        `Designation "${response.name}" created successfully!`
                    );
                    this.ref.close({
                        success: true,
                        designation: response,
                        action: 'create',
                    });
                },
                error: (error) => this.handleError(error, 'create'),
            });
        }
    }

    private handleError(error: any, action: string): void {
        console.error(`Error ${action}ing designation:`, error);
        this.isSubmitting = false;

        let errorMessage = `Failed to ${action} designation. Please try again.`;
        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 409) {
            errorMessage = 'A designation with this name already exists.';
        } else if (error.status >= 500) {
            errorMessage = 'Server error occurred. Please try again later.';
        }

        this.showError(errorMessage);
    }

    onCancel(): void {
        if (this.designationForm.dirty) {
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
            this.initializeForm();
        }
    }

    private markAllFieldsAsTouched(): void {
        Object.keys(this.designationForm.controls).forEach((key) => {
            this.designationForm.get(key)?.markAsTouched();
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.designationForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.designationForm.get(fieldName);
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
            name: 'Designation Name',
        };
        return labels[fieldName] || fieldName;
    }

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
}
