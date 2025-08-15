import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { FolderStorageDataService } from 'src/app/core/dataservice/Folder Storage/folder.storage.dataservice';
import {
    FileLocationDTO,
    CreateFileLocationDTO,
    FilelocationCategoryDTO,
} from 'src/app/core/dataservice/Folder Storage/folder.storage.dto';

@Component({
    selector: 'app-admin-file-location-dialog',
    templateUrl: './admin-file-location-dialog.component.html',
    styleUrls: ['./admin-file-location-dialog.component.css'],

    providers: [MessageService],
})
export class AdminFileLocationDialogComponent implements OnInit {
    fileLocationForm!: FormGroup;
    isSubmitting = false;
    isEditMode = false;
    fileLocation: FileLocationDTO | null = null;
    categories: FilelocationCategoryDTO[] = [];
    selectedCategory: FilelocationCategoryDTO | null = null;

    constructor(
        private fb: FormBuilder,
        private folderStorageService: FolderStorageDataService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
        this.fileLocation = this.config.data?.fileLocation || null;
        this.categories = this.config.data?.categories || [];
        this.selectedCategory = this.config.data?.category || null;
        this.isEditMode = !!this.fileLocation;
    }

    ngOnInit() {
        this.initializeForm();
    }

    private initializeForm(): void {
        this.fileLocationForm = this.fb.group({
            name: [
                this.fileLocation?.name || '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ],
            ],
            categoryId: [
                this.fileLocation?.categoryId ||
                    this.selectedCategory?.id ||
                    '',
                [Validators.required],
            ],
        });

        // Disable category selection if category is pre-selected
        if (this.selectedCategory) {
            this.fileLocationForm.get('categoryId')?.disable();
        }
    }

    onSubmit(): void {
        if (this.fileLocationForm.invalid) {
            this.markAllFieldsAsTouched();
            this.showError('Please fill in all required fields correctly');
            return;
        }

        this.isSubmitting = true;
        const formValue = this.fileLocationForm.value;

        if (this.isEditMode && this.fileLocation) {
            // Update existing file location - assuming update endpoint exists
            this.showError('Update functionality not implemented yet');
            this.isSubmitting = false;
        } else {
            // Create new file location
            const createData: CreateFileLocationDTO = {
                name: formValue.name.trim(),
                categoryId: this.selectedCategory
                    ? this.selectedCategory.id
                    : formValue.categoryId,
            };

            this.folderStorageService.CreateFileLocation(createData).subscribe({
                next: (response) => {
                    this.showSuccess(
                        `File Location "${response.name}" created successfully!`
                    );
                    this.ref.close({
                        success: true,
                        fileLocation: response,
                        action: 'create',
                        categoryId: createData.categoryId,
                    });
                },
                error: (error) => this.handleError(error, 'create'),
            });
        }
    }

    private handleError(error: any, action: string): void {
        console.error(`Error ${action}ing file location:`, error);
        this.isSubmitting = false;

        let errorMessage = `Failed to ${action} file location. Please try again.`;
        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 409) {
            errorMessage =
                'A file location with this name already exists in this category.';
        } else if (error.status >= 500) {
            errorMessage = 'Server error occurred. Please try again later.';
        }

        this.showError(errorMessage);
    }

    onCancel(): void {
        if (this.fileLocationForm.dirty) {
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
        Object.keys(this.fileLocationForm.controls).forEach((key) => {
            this.fileLocationForm.get(key)?.markAsTouched();
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.fileLocationForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.fileLocationForm.get(fieldName);
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
            name: 'File Location Name',
            categoryId: 'Category',
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
