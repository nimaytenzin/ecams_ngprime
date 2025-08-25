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
    years: number[] = [2021, 2022, 2023, 2024, 2025];
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
        this.loadInitialData();
    }

    private loadInitialData() {
        // Load file locations
        this.folderStorageService
            .GetAllFileLocationCategoriesByDepartment(
                this.authService.GetAuthenticatedUser().department.id
            )
            .subscribe((locations) => {
                this.fileLocationCategories = locations;
                console.log('file location categories', locations);
            });
    }

    getReadableDate(isoDate: string): string {
        const readable = new Date(isoDate);
        return `\${readable.getDate()}/\${readable.getMonth() + 1}/\${readable.getFullYear()}`;
    }

    selectYear(year: number) {
        this.yearSelected = year;
    }
    loadLocationsByCategory(category: FilelocationCategoryDTO) {
        this.selectedFileLocationCategory = category; // Add this line
        this.folderStorageService
            .GetAllFileLocationsByCategory(category.id)
            .subscribe((locations) => {
                this.fileLocations = locations;
                console.log('file locations', locations);
            });
    }

    viewDetails(id: number) {
        this.router.navigate(['/staff/letters/view', id]);
    }

    resetSelection() {
        this.yearSelected = null;
        this.selectedFileLocationCategory = null;
        this.selectedFileLocation = null;
        this.fileLocations = [];
    }
}
