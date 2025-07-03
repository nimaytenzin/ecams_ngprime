import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AdminLayoutService } from '../service/admin-layout.service';
import { API_URL, ASSET_URL } from 'src/app/core/constants/constants';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SidebarModule } from 'primeng/sidebar';
import { UserDTO } from 'src/app/core/dataservice/User/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/User/user.dataservice';
import { USERROLESENUM } from 'src/app/core/constants/enums';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import {
    AuthenticatedUserDTO,
    CurrentRoleDTO,
} from 'src/app/core/dataservice/User/dto/auth.dto';
import { AvatarModule } from 'primeng/avatar';
import { StaffUpdateProfileComponent } from 'src/app/presentations/staff/users/staff-update-profile/staff-update-profile.component';

@Component({
    selector: 'app-admin-topbar',
    templateUrl: './admin-topbar.component.html',
    styleUrls: ['./admin-topbar.component.css'],
    standalone: true,
    imports: [
        OverlayPanelModule,
        CommonModule,
        DividerModule,
        ButtonModule,
        PasswordModule,
        ToastModule,
        ConfirmPopupModule,
        SidebarModule,
        DialogModule,
        FormsModule,
        InputTextModule,
        AvatarModule,
        StaffUpdateProfileComponent,
    ],
    providers: [ConfirmationService, MessageService],
})
export class AdminTopbarComponent {
    items!: MenuItem[];
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    authenticatedUser: AuthenticatedUserDTO;
    currentRole: CurrentRoleDTO;

    profileSideBarVisible: boolean = false;

    profileUri: string;

    isNotVerified: boolean = false;

    newPassword: string | null;
    newPasswordReentry: string | null;

    constructor(
        public layoutService: AdminLayoutService,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private userService: UserDataService
    ) {
        this.authenticatedUser = this.authService.GetAuthenticatedUser();
        this.profileUri = ASSET_URL + '/' + this.authenticatedUser.profileUri;
        console.log(this.profileUri);
    }

    logout() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to Logout?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Logging out',
                    detail: 'You have been logged out',
                    life: 3000,
                });
                this.authService.LogOut();
            },
        });
    }

    resetPassword() {}
}
