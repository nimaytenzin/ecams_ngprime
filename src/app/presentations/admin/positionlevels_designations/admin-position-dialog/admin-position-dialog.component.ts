import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PositionDataService } from 'src/app/core/dataservice/Position/position.dataservice';
import {
    PositionDTO,
    CreatePositionDTO,
} from 'src/app/core/dataservice/Position/position.dto';

@Component({
    selector: 'app-admin-position-dialog',
    templateUrl: './admin-position-dialog.component.html',
    styleUrls: ['./admin-position-dialog.component.css'],
    providers: [MessageService],
})
export class AdminPositionDialogComponent implements OnInit {
    positionForm!: FormGroup;
    isSubmitting = false;
    isEditMode = false;
    position: PositionDTO | null = null;

    categories = [
        { label: 'Executive & Specialist', value: 'Executive & Specialist' },
        {
            label: 'Professional & Management',
            value: 'Professional & Management',
        },
        {
            label: 'Supervisory & Support',
            value: 'Supervisory & Support',
        },
        { label: 'Others', value: 'Others' },
    ];

    constructor(
        private fb: FormBuilder,
        private positionService: PositionDataService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
        this.position = this.config.data?.position || null;
        this.isEditMode = !!this.position;
    }

    ngOnInit() {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.positionForm = this.fb.group({
            name: [
                this.position?.name || '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ],
            ],
            category: [this.position?.category || '', [Validators.required]],
            hierarchical_level: [
                this.position?.hierarchical_level || 1,
                [Validators.required, Validators.min(1), Validators.max(20)],
            ],
        });
    }

    onSubmit(): void {
        if (this.positionForm.invalid) {
            this.markAllFieldsAsTouched();
            this.showError('Please fill in all required fields correctly');
            return;
        }

        this.isSubmitting = true;
        const formValue = this.positionForm.value;

        if (this.isEditMode && this.position) {
            // Update existing position
            const updateData: Partial<PositionDTO> = {
                name: formValue.name.trim(),
                category: formValue.category,
                hierarchical_level: formValue.hierarchical_level,
            };

            this.positionService
                .UpdatePositionLevel(this.position.id, updateData)
                .subscribe({
                    next: (response) => {
                        this.showSuccess(
                            response || 'Position updated successfully!'
                        );
                        // Return the updated position data
                        const updatedPosition: PositionDTO = {
                            ...this.position!,
                            ...updateData,
                        };
                        this.ref.close({
                            success: true,
                            position: updatedPosition,
                            action: 'update',
                        });
                    },
                    error: (error) => this.handleError(error, 'update'),
                });
        } else {
            // Create new position
            const createData: CreatePositionDTO = {
                name: formValue.name.trim(),
                category: formValue.category,
                hierarchical_level: formValue.hierarchical_level,
            };

            this.positionService
                .CreatePositionLevel(createData as PositionDTO)
                .subscribe({
                    next: (response) => {
                        this.showSuccess(
                            `Position "${response.name}" created successfully!`
                        );
                        this.ref.close({
                            success: true,
                            position: response,
                            action: 'create',
                        });
                    },
                    error: (error) => this.handleError(error, 'create'),
                });
        }
    }

    private handleError(error: any, action: string): void {
        console.error(`Error ${action}ing position:`, error);
        this.isSubmitting = false;

        let errorMessage = `Failed to ${action} position. Please try again.`;
        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 409) {
            errorMessage = 'A position with this name or level already exists.';
        } else if (error.status >= 500) {
            errorMessage = 'Server error occurred. Please try again later.';
        }

        this.showError(errorMessage);
    }

    onCancel(): void {
        if (this.positionForm.dirty) {
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
        Object.keys(this.positionForm.controls).forEach((key) => {
            this.positionForm.get(key)?.markAsTouched();
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.positionForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.positionForm.get(fieldName);
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
        if (errors['min'])
            return `${this.getFieldLabel(fieldName)} must be at least ${
                errors['min'].min
            }`;
        if (errors['max'])
            return `${this.getFieldLabel(fieldName)} cannot exceed ${
                errors['max'].max
            }`;

        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            name: 'Position Name',
            category: 'Category',
            hierarchical_level: 'Hierarchical Level',
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
