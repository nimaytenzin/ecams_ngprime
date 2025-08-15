import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FolderStorageDataService } from 'src/app/core/dataservice/Folder Storage/folder.storage.dataservice';
import {
    FilelocationCategoryDTO,
    FileLocationDTO,
} from 'src/app/core/dataservice/Folder Storage/folder.storage.dto';
import { AdminFileLocationCategoryDialogComponent } from '../admin-file-location-category-dialog/admin-file-location-category-dialog.component';
import { AdminFileLocationDialogComponent } from '../admin-file-location-dialog/admin-file-location-dialog.component';

@Component({
    selector: 'app-admin-folder-category-listing',
    templateUrl: './admin-folder-category-listing.component.html',
    styleUrls: ['./admin-folder-category-listing.component.css'],
    providers: [MessageService, DialogService],
})
export class AdminFolderCategoryListingComponent implements OnInit {
    categories: FilelocationCategoryDTO[] = [];
    loading = false;

    constructor(
        private folderStorageService: FolderStorageDataService,
        private messageService: MessageService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.loading = true;
        this.folderStorageService.GetAllFileLocationCategories().subscribe({
            next: (categories) => {
                this.categories = categories.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading categories:', error);
                this.showError('Failed to load file location categories');
                this.loading = false;
            },
        });
    }

    refresh() {
        this.loadCategories();
    }

    // Category Management
    addCategory() {
        const ref = this.dialogService.open(
            AdminFileLocationCategoryDialogComponent,
            {
                header: 'Create New File Location Category',
                width: '450px',
                modal: true,
                breakpoints: {
                    '960px': '90vw',
                    '640px': '95vw',
                },
            }
        );

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `Category "${result.category.name}" ${result.action}d successfully!`
                );
                this.loadCategories();
            }
        });
    }

    editCategory(category: FilelocationCategoryDTO) {
        const ref = this.dialogService.open(
            AdminFileLocationCategoryDialogComponent,
            {
                header: `Edit Category: ${category.name}`,
                width: '450px',
                modal: true,
                breakpoints: {
                    '960px': '90vw',
                    '640px': '95vw',
                },
                data: {
                    category: category,
                },
            }
        );

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `Category "${result.category.name}" ${result.action}d successfully!`
                );
                this.loadCategories();
            }
        });
    }

    // File Location Management
    addFileLocation(category?: FilelocationCategoryDTO) {
        const ref = this.dialogService.open(AdminFileLocationDialogComponent, {
            header: category
                ? `Create New File Location in ${category.name}`
                : 'Create New File Location',
            width: '500px',
            modal: true,
            breakpoints: {
                '960px': '90vw',
                '640px': '95vw',
            },
            data: {
                category: category,
                categories: this.categories,
            },
        });

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `File Location "${result.fileLocation.name}" ${result.action}d successfully!`
                );
                this.loadCategories(); // Refresh to update file location counts
            }
        });
    }

    editFileLocation(fileLocation: FileLocationDTO) {
        const ref = this.dialogService.open(AdminFileLocationDialogComponent, {
            header: `Edit File Location: ${fileLocation.name}`,
            width: '500px',
            modal: true,
            breakpoints: {
                '960px': '90vw',
                '640px': '95vw',
            },
            data: {
                fileLocation: fileLocation,
                categories: this.categories,
            },
        });

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `File Location "${result.fileLocation.name}" ${result.action}d successfully!`
                );
                this.loadCategories(); // Refresh to update file location counts
            }
        });
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories.find((c) => c.id === categoryId);
        return category ? category.name : 'Unknown';
    }

    getFileLocationsForCategory(
        category: FilelocationCategoryDTO
    ): FileLocationDTO[] {
        return category.filelocations || [];
    }

    getAllFileLocations(): FileLocationDTO[] {
        const allFileLocations: FileLocationDTO[] = [];
        this.categories.forEach((category) => {
            if (category.filelocations) {
                allFileLocations.push(...category.filelocations);
            }
        });
        return allFileLocations.sort((a, b) => a.name.localeCompare(b.name));
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000,
        });
    }

    private showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
        });
    }
}
