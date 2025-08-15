import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

// Admin Components
import { AdminDepartmentDivisionListingsComponent } from './departments_divisions/admin-department-division-listings/admin-department-division-listings.component';
import { AdminCreateDepartmentComponent } from './departments_divisions/admin-create-department/admin-create-department.component';
import { AdminEditDepartmentComponent } from './departments_divisions/admin-edit-department/admin-edit-department.component';
import { AdminCreateDivisionComponent } from './departments_divisions/admin-create-division/admin-create-division.component';
import { AdminPositionLevelDesignationsListingsComponent } from './positionlevels_designations/admin-position-level-designations-listings/admin-position-level-designations-listings.component';
import { AdminPositionDialogComponent } from './positionlevels_designations/admin-position-dialog/admin-position-dialog.component';
import { AdminDesignationDialogComponent } from './positionlevels_designations/admin-designation-dialog/admin-designation-dialog.component';
import { AdminFolderCategoryListingComponent } from './folder_structure/admin-folder-category-listing/admin-folder-category-listing.component';

// Routing
import { AdminRoutingModule } from './admin.routing.module';
import { AdminFileLocationCategoryDialogComponent } from './folder_structure/admin-file-location-category-dialog/admin-file-location-category-dialog.component';
import { AdminFileLocationDialogComponent } from './folder_structure/admin-file-location-dialog/admin-file-location-dialog.component';

@NgModule({
    declarations: [
        AdminDepartmentDivisionListingsComponent,
        AdminCreateDepartmentComponent,
        AdminEditDepartmentComponent,
        AdminCreateDivisionComponent,
        AdminPositionLevelDesignationsListingsComponent,
        AdminPositionDialogComponent,
        AdminDesignationDialogComponent,
        AdminFolderCategoryListingComponent,
        AdminFileLocationCategoryDialogComponent,
        AdminFileLocationDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminRoutingModule,

        // PrimeNG Modules
        TableModule,
        ButtonModule,
        ToastModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        DropdownModule,
        TagModule,
        TooltipModule,
        RippleModule,
        CheckboxModule,
        MenuModule,
        SplitButtonModule,
        CardModule,
        DividerModule,
        DynamicDialogModule,
    ],
    providers: [],
})
export class AdminModule {}
