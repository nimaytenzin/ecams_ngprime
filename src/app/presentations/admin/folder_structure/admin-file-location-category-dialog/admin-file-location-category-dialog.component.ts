import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FolderStorageDataService } from 'src/app/core/dataservice/Folder Storage/folder.storage.dataservice';
import {
    FilelocationCategoryDTO,
    CreateFileLocationCategoryDTO,
} from 'src/app/core/dataservice/Folder Storage/folder.storage.dto';

@Component({
    selector: 'app-admin-file-location-category-dialog',
    templateUrl: './admin-file-location-category-dialog.component.html',
    styleUrls: ['./admin-file-location-category-dialog.component.css'],
    providers: [MessageService],
})
export class AdminFileLocationCategoryDialogComponent implements OnInit {
    categoryForm!: FormGroup;
    isSubmitting = false;
    isEditMode = false;
    category: FilelocationCategoryDTO | null = null;

    constructor(
        private fb: FormBuilder,
        private folderStorageService: FolderStorageDataService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
        this.category = this.config.data?.category || null;
        this.isEditMode = !!this.category;
    }

    ngOnInit() {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.categoryForm = this.fb.group({
            name: [
                this.category?.name || '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
            ],
        });
    }

    onSubmit(): void {
        if (this.categoryForm.invalid) {
            this.markAllFieldsAsTouched();
            this.showError('Please fill in all required fields correctly');
            return;
        }

        this.isSubmitting = true;
        const formValue = this.categoryForm.value;

        if (this.isEditMode && this.category) {
            // Update existing category - assuming update endpoint exists
            this.showError('Update functionality not implemented yet');
            this.isSubmitting = false;
        } else {
            // Create new category
            const createData: CreateFileLocationCategoryDTO = {
                name: formValue.name.trim(),
            };

            this.folderStorageService
                .CreateFileLocationCategory(createData)
                .subscribe({
                    next: (response) => {
                        this.showSuccess(
                            `Category "${response.name}" created successfully!`
                        );
                        this.ref.close({
                            success: true,
                            category: response,
                            action: 'create',
                        });
                    },
                    error: (error) => this.handleError(error, 'create'),
                });
        }
    }

    private handleError(error: any, action: string): void {
        console.error(`Error ${action}ing category:`, error);
        this.isSubmitting = false;

        let errorMessage = `Failed to ${action} category. Please try again.`;
        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 409) {
            errorMessage = 'A category with this name already exists.';
        } else if (error.status >= 500) {
            errorMessage = 'Server error occurred. Please try again later.';
        }

        this.showError(errorMessage);
    }

    onCancel(): void {
        if (this.categoryForm.dirty) {
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
        Object.keys(this.categoryForm.controls).forEach((key) => {
            this.categoryForm.get(key)?.markAsTouched();
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.categoryForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.categoryForm.get(fieldName);
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
            name: 'Category Name',
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
