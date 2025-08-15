import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminLayoutComponent } from './presentations/layout/admin/admin-layout.component';

import { RoleGuard } from './core/guards/role.guard';
import { USERROLESENUM } from './core/constants/enums';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    loadChildren: () =>
                        import('./presentations/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },

                {
                    path: 'admin',
                    component: AdminLayoutComponent,
                    canActivate: [RoleGuard],
                    data: {
                        roles: [USERROLESENUM.admin],
                    },
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './presentations/admin/admin.module'
                                ).then((m) => m.AdminModule),
                        },
                    ],
                },
                {
                    path: 'staff',
                    component: AdminLayoutComponent,
                    canActivate: [RoleGuard],
                    data: {
                        roles: [USERROLESENUM.staff],
                    },
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './presentations/staff/home/staff-home.routing.module'
                                ).then((m) => m.StaffHomeRoutingModule),
                        },
                        {
                            path: 'letter',
                            loadChildren: () =>
                                import(
                                    './presentations/staff/letters/staff-letters.routing.module'
                                ).then((m) => m.StaffLettersRoutingModule),
                        },
                        {
                            path: 'search',
                            loadChildren: () =>
                                import(
                                    './presentations/staff/search/staff-search.routing.module'
                                ).then((m) => m.StaffSearchRoutingModule),
                        },
                        {
                            path: 'department',
                            loadChildren: () =>
                                import(
                                    './presentations/staff/department-profile/staff-department.routing.module'
                                ).then((m) => m.StaffDepartmentRoutingModule),
                        },
                        {
                            path: 'users',
                            loadChildren: () =>
                                import(
                                    './presentations/staff/users/staff-users.routing.module'
                                ).then((m) => m.StaffUsersRoutingModule),
                        },
                    ],
                },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
