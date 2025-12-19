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
import { AuthenticatedUserDTO } from 'src/app/core/dataservice/User/dto/auth.dto';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';

@Component({
    selector: 'app-admin-folder-category-listing',
    templateUrl: './admin-folder-category-listing.component.html',
    styleUrls: ['./admin-folder-category-listing.component.css'],
    providers: [MessageService, DialogService],
})
export class AdminFolderCategoryListingComponent implements OnInit {
    categories: FilelocationCategoryDTO[] = [];
    loading = false;
    loadingLocations: { [categoryId: number]: boolean } = {};
    expandedCategories: { [categoryId: number]: boolean } = {};
    authenticatedUser: AuthenticatedUserDTO;

    constructor(
        private folderStorageService: FolderStorageDataService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();
        this.loadCategories();
    }

    loadCategories() {
        if (!this.authenticatedUser?.department?.id) {
            console.error('Authenticated user or department not available');
            this.showError('User authentication information is not available');
            return;
        }
        this.loading = true;
        this.folderStorageService
            .GetAllFileLocationCategoriesByDepartment(
                this.authenticatedUser.department.id
            )
            .subscribe({
                next: (categories) => {
                    this.categories = categories.sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    // Load file locations for each category
                    this.loadFileLocationsForAllCategories();
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading categories:', error);
                    this.showError('Failed to load file location categories');
                    this.loading = false;
                },
            });
    }

    loadFileLocationsForAllCategories() {
        this.categories.forEach((category) => {
            this.loadFileLocationsForCategory(category);
        });
    }

    loadFileLocationsForCategory(category: FilelocationCategoryDTO) {
        this.loadingLocations[category.id] = true;
        this.folderStorageService
            .GetAllFileLocationsByCategory(category.id)
            .subscribe({
                next: (locations) => {
                    // Update the category with loaded file locations
                    const categoryIndex = this.categories.findIndex(
                        (c) => c.id === category.id
                    );
                    if (categoryIndex !== -1) {
                        this.categories[categoryIndex].filelocations =
                            locations.sort((a, b) =>
                                a.name.localeCompare(b.name)
                            );
                    }
                    this.loadingLocations[category.id] = false;
                },
                error: (error) => {
                    console.error(
                        `Error loading file locations for category ${category.id}:`,
                        error
                    );
                    this.loadingLocations[category.id] = false;
                    // Initialize empty array if loading fails
                    const categoryIndex = this.categories.findIndex(
                        (c) => c.id === category.id
                    );
                    if (categoryIndex !== -1) {
                        this.categories[categoryIndex].filelocations = [];
                    }
                },
            });
    }

    toggleCategory(categoryId: number) {
        this.expandedCategories[categoryId] =
            !this.expandedCategories[categoryId];
    }

    isCategoryExpanded(categoryId: number): boolean {
        return this.expandedCategories[categoryId] !== false; // Default to expanded
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
                // Reload file locations for the affected category
                if (category) {
                    this.loadFileLocationsForCategory(category);
                } else {
                    this.loadCategories(); // Refresh all if no specific category
                }
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
                // Find and reload the category for this file location
                const category = this.categories.find(
                    (c) => c.id === fileLocation.categoryId
                );
                if (category) {
                    this.loadFileLocationsForCategory(category);
                } else {
                    this.loadCategories(); // Refresh all if category not found
                }
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
