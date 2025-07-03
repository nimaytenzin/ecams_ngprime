import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ASSET_URL } from 'src/app/core/constants/constants';
import { UserDTO } from 'src/app/core/dataservice/User/dto/user.dto';
import { UserDataService } from 'src/app/core/dataservice/User/user.dataservice';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';
import { DivisionDTO } from 'src/app/core/dataservice/Division/division.dto';
import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { DivisionDataService } from 'src/app/core/dataservice/Division/division.dataservice';
import { DropdownModule } from 'primeng/dropdown';
import { DesignationDTO } from 'src/app/core/dataservice/Designation/designation.dto';
import { PositionDTO } from 'src/app/core/dataservice/Position/position.dto';
import { DesignationDataService } from 'src/app/core/dataservice/Designation/designation.dataservice';
import { PositionDataService } from 'src/app/core/dataservice/Position/position.dataservice';
import { ButtonModule } from 'primeng/button';
import { STAFFSTATUSENUM } from 'src/app/core/constants/enums';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PasswordModule } from 'primeng/password';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';
import { ToastModule } from 'primeng/toast';
('primeng/PasswordInputModule');
@Component({
    selector: 'app-staff-update-profile',
    templateUrl: './staff-update-profile.component.html',
    styleUrls: ['./staff-update-profile.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        DividerModule,
        InputTextModule,
        ReactiveFormsModule,
        InputGroupAddonModule,
        InputGroupModule,
        InputNumberModule,
        DropdownModule,
        InputTextareaModule,
        ButtonModule,
        FileUploadModule,
        PasswordModule,
        ToastModule,
    ],
    providers: [MessageService],
})
export class StaffUpdateProfileComponent implements OnInit {
    @Input({ required: true }) staffId!: number;

    designations: DesignationDTO[];
    positions: PositionDTO[];
    staff: UserDTO;
    departments: DepartmentDTO[];
    divisions: DivisionDTO[];
    updateUserForm: FormGroup;

    showPasswordChangeModal: boolean = false;

    staffStatuses: string[] = Object.values(STAFFSTATUSENUM);
    showUploadDialog: boolean = false;
    selectedProfileImage: File | null = null;

    passwordForm: FormGroup;

    constructor(
        private userDataService: UserDataService,
        private fb: FormBuilder,
        private departmentDataService: DepartmentDataService,
        private divisionDataService: DivisionDataService,
        private designationDataService: DesignationDataService,
        private positionDataService: PositionDataService,
        private messageService: MessageService,
        private AuthService: AuthService
    ) {
        this.updateUserForm = this.fb.group({
            name: ['', Validators.required],
            cid: [''],
            employeeId: [''],
            email: ['', Validators.required],
            contact: ['', Validators.required],
            address: [''],
            bio: [''],
            positionId: [],
            designationId: [],
            departmentId: [],
            divisionId: [],
            staffStatus: [],
        });

        this.passwordForm = this.fb.group(
            {
                newPassword: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
                confirmPassword: ['', Validators.required],
            },
            { validator: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('newPassword')?.value ===
            form.get('confirmPassword')?.value
            ? null
            : { mismatch: true };
    }

    ngOnInit() {
        this.getUserDetails();
        this.departmentDataService.GetAllDepartments().subscribe({
            next: (res) => {
                this.departments = res;
                this.getDivisionsByDepartment();
            },
        });
        this.designationDataService.GetAllDesignations().subscribe({
            next: (res) => {
                this.designations = res;
            },
        });
        this.positionDataService.GetAllPositions().subscribe({
            next: (res) => {
                this.positions = res;
            },
        });
    }
    getUserDetails() {
        this.userDataService.GetUserDetails(this.staffId).subscribe({
            next: (res) => {
                this.staff = res;
                console.log('SUER DETAILS', res);
                this.updateUserForm.patchValue({ ...res });
            },
        });
    }

    getDivisionsByDepartment() {
        this.divisionDataService.GetDivisionsByDepartment(1).subscribe({
            next: (res) => {
                this.divisions = res;
            },
        });
    }

    getImgUrl(url: string) {
        return {
            backgroundImage: `url(${ASSET_URL}/${url})`,
            height: '10rem',
            width: '10rem',
            borderRadius: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        };
    }

    updateUserDetails() {
        const data = {
            id: this.staff.id,
            ...this.updateUserForm.value,
        };
        this.userDataService
            .UpdateUserDetails(this.staff.id, data)
            .subscribe((res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User Details Updated.',
                });
                this.getUserDetails();
            });
    }

    openUploadProfileModal() {
        this.showUploadDialog = true;
    }

    closeUploadProfileModal() {
        this.showUploadDialog = false;
    }

    onProfileImageChange(event: any) {
        const file =
            event.files && event.files.length > 0 ? event.files[0] : null;
        if (file) {
            this.selectedProfileImage = file;
            console.log('Selected file:', file);
        }
    }
    uploadProfileImage() {
        if (!this.selectedProfileImage) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Photo Selected',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedProfileImage);
        this.userDataService.UploadProfile(this.staff.id, formData).subscribe({
            next: (res) => {
                this.showUploadDialog = false;
                this.getUserDetails();
            },
        });
    }

    openChangePasswordModal() {
        this.passwordForm.reset();
        this.showPasswordChangeModal = true;
    }

    closePasswordChangeModal() {
        this.showPasswordChangeModal = false;
    }

    changePassword() {
        if (this.passwordForm.valid) {
            const { newPassword, confirmPassword } = this.passwordForm.value;

            this.AuthService.ChangePassword(
                this.AuthService.GetAuthenticatedUser().id,
                {
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                }
            ).subscribe((res) => {
                if (res) {
                    console.log(res);
                }
            });
            this.showPasswordChangeModal = false;
        }
    }
}
