import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDepartmentDivisionListingsComponent } from './departments_divisions/admin-department-division-listings/admin-department-division-listings.component';
import { AdminCreateDepartmentComponent } from './departments_divisions/admin-create-department/admin-create-department.component';
import { AdminPositionLevelDesignationsListingsComponent } from './positionlevels_designations/admin-position-level-designations-listings/admin-position-level-designations-listings.component';
import { AdminFolderCategoryListingComponent } from './folder_structure/admin-folder-category-listing/admin-folder-category-listing.component';

const routes: Routes = [
    {
        path: 'departments',
        component: AdminDepartmentDivisionListingsComponent,
    },
    {
        path: 'departments/create',
        component: AdminCreateDepartmentComponent,
    },
    {
        path: 'positions',
        component: AdminPositionLevelDesignationsListingsComponent,
    },
    {
        path: 'folders',
        component: AdminFolderCategoryListingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {}
