import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { AuthService } from '../dataservice/User/auth.service';
import { MessageService } from 'primeng/api';
import { AuthenticatedUserDTO } from '../dataservice/User/dto/auth.dto';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const user: AuthenticatedUserDTO =
            this.authService.GetAuthenticatedUser();

        // if (user && user.roles && this.hasRole(user, next.data['roles'])) {
        //     return true;
        // } else {
        //     this.messageService.add({
        //         severity: 'warn',
        //         summary: 'Forbidden',
        //         detail: 'You don’t have enough permission to view the requested resource',
        //     });
        //     return false;
        // }

        return true;
    }

    private hasRole(
        user: AuthenticatedUserDTO,
        allowedRoles: string[]
    ): boolean {
        const userRolesArray = user.role;
        return true;
    }
}
