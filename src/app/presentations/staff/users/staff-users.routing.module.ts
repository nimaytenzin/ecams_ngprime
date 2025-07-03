import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffCreateUserComponent } from './staff-create-user/staff-create-user.component';
import { StaffUpdateProfileComponent } from './staff-update-profile/staff-update-profile.component';

const routes: Routes = [
    {
        path: 'create',
        component: StaffCreateUserComponent,
    },
    {
        path: 'update/:id',
        component: StaffUpdateProfileComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StaffUsersRoutingModule {}
