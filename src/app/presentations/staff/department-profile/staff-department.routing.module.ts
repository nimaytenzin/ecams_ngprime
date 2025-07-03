import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffDepartmentOrganogramComponent } from './staff-department-organogram/staff-department-organogram.component';

const routes: Routes = [
    {
        path: '',
        component: StaffDepartmentOrganogramComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StaffDepartmentRoutingModule {}
