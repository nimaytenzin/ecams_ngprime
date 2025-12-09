import { USERROLESENUM } from './enums';

export const STAFF_SIDEBARITEMS = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/staff'],
                roles: [USERROLESENUM.staff, USERROLESENUM.dispatch],
            },
            {
                label: 'All Letters',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/staff/letter'],
                roles: [USERROLESENUM.staff, USERROLESENUM.dispatch],
            },
            {
                label: 'Confidential Letters',
                icon: 'pi pi-fw pi-lock',
                routerLink: ['/staff/letter/confidential'],
                roles: [USERROLESENUM.staff, USERROLESENUM.dispatch],
            },
            {
                label: 'Archive',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/staff/archive'],
                roles: [USERROLESENUM.staff, USERROLESENUM.dispatch],
            },
            {
                label: 'Upload Letter',
                icon: 'pi pi-fw pi-upload',
                routerLink: ['/staff/letter/upload'],
                roles: [USERROLESENUM.staff, USERROLESENUM.dispatch],
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search',
                routerLink: ['/staff/search'],
                roles: [USERROLESENUM.staff, USERROLESENUM.dispatch],
            },
            {
                label: 'Department Profile',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/staff/department'],
                roles: [USERROLESENUM.staff, USERROLESENUM.dispatch],
            },
        ],
    },
];
export const ADMIN_SIDEBARITEMS = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/staff'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin, USERROLESENUM.dispatch],
            },
            {
                label: 'All Letters',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/staff/letter'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin, USERROLESENUM.dispatch],
            },
            {
                label: 'Confidential Letters',
                icon: 'pi pi-fw pi-lock',
                routerLink: ['/staff/letter/confidential'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin, USERROLESENUM.dispatch],
            },
            {
                label: 'Archive',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/staff/archive'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin, USERROLESENUM.dispatch],
            },
            {
                label: 'Upload Letter',
                icon: 'pi pi-fw pi-upload',
                routerLink: ['/staff/letter/upload'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin, USERROLESENUM.dispatch],
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search',
                routerLink: ['/staff/search'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin, USERROLESENUM.dispatch],
            },
            {
                label: 'Department Profile',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/staff/department'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin, USERROLESENUM.dispatch],
            },
            {
                label: 'Departments & Division',
                icon: 'pi pi-fw pi-sitemap',
                routerLink: ['/admin/departments'],
                roles: [USERROLESENUM.admin],
            },
            {
                label: 'Position Level and Designations',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/admin/positions'],
                roles: [USERROLESENUM.admin],
            },
            {
                label: 'Folder Structures',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/admin/folders'],
                roles: [USERROLESENUM.admin],
            },
        ],
    },
];
