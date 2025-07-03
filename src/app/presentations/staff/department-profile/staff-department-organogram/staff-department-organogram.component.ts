import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ASSET_URL } from 'src/app/core/constants/constants';
import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { DepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { StaffCreateUserComponent } from '../../users/staff-create-user/staff-create-user.component';

@Component({
    selector: 'app-staff-department-organogram',
    templateUrl: './staff-department-organogram.component.html',
    styleUrls: ['./staff-department-organogram.component.css'],
    standalone: true,
    imports: [CommonModule, DividerModule, ButtonModule],
    providers: [DialogService, MessageService],
})
export class StaffDepartmentOrganogramComponent implements OnInit {
    department: DepartmentDTO;
    ref: DynamicDialogRef;
    constructor(
        private departmentDataService: DepartmentDataService,
        private authservice: AuthService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.loadDepartmentOrganogram();
    }

    getImgUrl(url: string) {
        return {
            backgroundImage: `url(${ASSET_URL}/${url})`,
            height: '7rem',
            width: '7rem',
            borderRadius: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        };
    }

    openCreateStaffDialog() {
        this.ref = this.dialogService.open(StaffCreateUserComponent, {
            header: 'Create New Staff Member',
            width: '70%',
            height: '80%',
            maximizable: true,
            dismissableMask: true,
            styleClass: 'create-staff-dialog',
        });

        this.ref.onClose.subscribe((result) => {
            if (result) {
                // Refresh the department organogram when a staff member is created
                this.loadDepartmentOrganogram();
            }
        });
    }

    private loadDepartmentOrganogram() {
        this.departmentDataService
            .GetDepartmentOrganogram(
                this.authservice.GetAuthenticatedUser().department.id
            )
            .subscribe({
                next: (res) => {
                    console.log('res', res);
                    this.department = res;
                },
            });
    }
}
