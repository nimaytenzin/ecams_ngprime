import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';

// Components
import { StaffCreateUserComponent } from './staff-create-user/staff-create-user.component';
import { StaffUpdateProfileComponent } from './staff-update-profile/staff-update-profile.component';

// Routing
import { StaffUsersRoutingModule } from './staff-users.routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        StaffUsersRoutingModule,

        // PrimeNG Modules
        ButtonModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        InputGroupModule,
        InputGroupAddonModule,
        PasswordModule,
        ToastModule,
        FileUploadModule,

        // Standalone Components
        StaffCreateUserComponent,
        StaffUpdateProfileComponent,
    ],
    exports: [StaffCreateUserComponent, StaffUpdateProfileComponent],
})
export class StaffUsersModule {}
