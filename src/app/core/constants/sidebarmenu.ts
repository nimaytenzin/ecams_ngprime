import { USERROLESENUM } from './enums';

export const STAFF_SIDEBARITEMS = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/staff'],
                roles: [USERROLESENUM.staff],
            },
            {
                label: 'All Letters',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/staff/letter'],
                roles: [USERROLESENUM.staff],
            },
            {
                label: 'Upload Letter',
                icon: 'pi pi-fw pi-upload',
                routerLink: ['/staff/letter/upload'],
                roles: [USERROLESENUM.staff],
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search',
                routerLink: ['/staff/search'],
                roles: [USERROLESENUM.staff],
            },
            {
                label: 'Department Profile',
                icon: 'pi pi-fw pi-users',
                routerLink: ['/staff/department'],
                roles: [USERROLESENUM.staff],
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
                roles: [USERROLESENUM.staff, USERROLESENUM.admin],
            },
            {
                label: 'All Letters',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/staff/letter'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin],
            },
            {
                label: 'Upload Letter',
                icon: 'pi pi-fw pi-upload',
                routerLink: ['/staff/letter/upload'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin],
            },
            {
                label: 'Search',
                icon: 'pi pi-fw pi-search',
                routerLink: ['/staff/search'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin],
            },
            {
                label: 'Department Profile',
                icon: 'pi pi-fw pi-id-card',
                routerLink: ['/staff/department'],
                roles: [USERROLESENUM.staff, USERROLESENUM.admin],
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
