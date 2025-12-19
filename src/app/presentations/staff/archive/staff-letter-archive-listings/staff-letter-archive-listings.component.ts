import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DivisionDataService } from 'src/app/core/dataservice/Division/division.dataservice';
import { DivisionDTO } from 'src/app/core/dataservice/Division/division.dto';
import { FolderStorageDataService } from 'src/app/core/dataservice/Folder Storage/folder.storage.dataservice';
import {
    FilelocationCategoryDTO,
    FileLocationDTO,
} from 'src/app/core/dataservice/Folder Storage/folder.storage.dto';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { MenuItem, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { AuthenticatedUserDTO } from 'src/app/core/dataservice/User/dto/auth.dto';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-staff-letter-archive-listings',
    templateUrl: './staff-letter-archive-listings.component.html',
    styleUrls: ['./staff-letter-archive-listings.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        ToastModule,
        BreadcrumbModule,
        CardModule,
        TooltipModule,
        DividerModule,
        ProgressSpinnerModule,
        RippleModule,
        DialogModule,
    ],
    providers: [MessageService],
})
export class StaffLetterArchiveListingsComponent implements OnInit {
    letters: any[] = [];
    years: number[] = [];
    fileLocationCategories: FilelocationCategoryDTO[] = [];
    selectedFileLocationCategory: FilelocationCategoryDTO | null = null;

    fileLocations: FileLocationDTO[] = [];
    selectedFileLocation: FileLocationDTO | null = null;

    yearSelected: number | null = null;

    loading = false;
    authenticatedUser: AuthenticatedUserDTO;

    constructor(
        private router: Router,
        private letterService: LetterDataService,
        private divisionService: DivisionDataService,
        private folderStorageService: FolderStorageDataService,
        private messageService: MessageService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();
        this.populateYears();
        this.loadInitialData();
    }

    private loadInitialData() {
        this.folderStorageService
            .GetAllFileLocationCategoriesByDepartment(
                this.authService.GetAuthenticatedUser().department.id
            )
            .subscribe((locations) => {
                // keep categories alphabetical
                this.fileLocationCategories = this.sortByName(locations);
            });
    }

    getReadableDate(isoDate: string): string {
        const readable = new Date(isoDate);
        return `\${readable.getDate()}/\${readable.getMonth() + 1}/\${readable.getFullYear()}`;
    }

    selectYear(year: number) {
        this.yearSelected = year;
    }

    getYearDate(year: number): Date {
        // Return January 1st of the year as a date
        return new Date(year, 0, 1);
    }

    selectFileLocation(location: FileLocationDTO) {
        this.selectedFileLocation = location;
        this.loading = true;
        // Load letters for the selected file location
        if (this.yearSelected && location.id) {
            const divisionId = this.authenticatedUser.division?.id || this.authenticatedUser.department.id;
            this.letterService
                .GetLettersForArchive(this.yearSelected, divisionId, location.id)
                .subscribe({
                    next: (letters) => {
                        this.letters = letters;
                        this.loading = false;
                    },
                    error: () => {
                        this.loading = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to load letters',
                        });
                    },
                });
        }
    }
    loadLocationsByCategory(category: FilelocationCategoryDTO) {
        this.selectedFileLocationCategory = category;
        this.folderStorageService
            .GetAllFileLocationsByCategory(category.id)
            .subscribe((locations) => {
                // keep file locations alphabetical
                this.fileLocations = this.sortByName(locations);
            });
    }

    viewDetails(id: number) {
        this.router.navigate(['/staff/letter/view', id]);
    }

    goBackToFileLocations() {
        this.selectedFileLocation = null;
        this.letters = [];
        // Reload file locations for the category
        if (this.selectedFileLocationCategory) {
            this.loadLocationsByCategory(this.selectedFileLocationCategory);
        }
    }

    resetSelection() {
        this.yearSelected = null;
        this.selectedFileLocationCategory = null;
        this.selectedFileLocation = null;
        this.fileLocations = [];
        this.letters = [];
    }

    get sortedLetters() {
        return [...this.letters].sort((a, b) =>
            (a.subject || '').localeCompare(b.subject || '')
        );
    }

    private populateYears() {
        const currentYear = new Date().getFullYear();
        const startYear = 2020;
        this.years = Array.from(
            { length: currentYear - startYear + 1 },
            (_, idx) => startYear + idx
        ).reverse();
    }

    private sortByName<T extends { name: string }>(items: T[]): T[] {
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
}
