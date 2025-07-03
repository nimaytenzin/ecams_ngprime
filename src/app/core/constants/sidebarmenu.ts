import { USERROLESENUM } from './enums';

export const ADMINSIDEBARITEMS = [
    {
        label: 'Home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/admin'],
                roles: [USERROLESENUM.admin],
            },
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
