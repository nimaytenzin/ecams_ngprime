import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AdminLayoutService } from '../service/admin-layout.service';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import {
    ADMIN_SIDEBARITEMS,
    STAFF_SIDEBARITEMS,
} from 'src/app/core/constants/sidebarmenu';

@Component({
    selector: 'app-admin-menu',
    templateUrl: './admin-menu.component.html',
})
export class AdminMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: AdminLayoutService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        console.log('GETTING ROLE ', this.authService.GetCurrentRole().name);
        const userRole = this.authService.GetCurrentRole().name;

        if (userRole === 'admin') {
            this.model = ADMIN_SIDEBARITEMS;
        }

        if (userRole === 'staff' || userRole === 'dispatch') {
            this.model = STAFF_SIDEBARITEMS;
        }
        // this.model = this.filterMenuItemsByRole(ADMINSIDEBARITEMS, userRole);
        console.log(userRole, this.model);
    }

    private filterMenuItemsByRole(items: any[], role: string): any[] {
        return items
            .map((item) => {
                if (item.items) {
                    return {
                        ...item,
                        items: item.items.filter((subItem) =>
                            subItem.roles?.includes(role)
                        ),
                    };
                }
                return item;
            })
            .filter((item) => item.items?.length);
    }
}
