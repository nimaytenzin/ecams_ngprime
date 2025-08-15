import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { DepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';
import { DivisionDTO } from 'src/app/core/dataservice/Division/division.dto';
import { AdminCreateDepartmentComponent } from '../admin-create-department/admin-create-department.component';
import { AdminEditDepartmentComponent } from '../admin-edit-department/admin-edit-department.component';
import { AdminCreateDivisionComponent } from '../admin-create-division/admin-create-division.component';

@Component({
    selector: 'app-admin-department-division-listings',
    templateUrl: './admin-department-division-listings.component.html',
    styleUrls: ['./admin-department-division-listings.component.css'],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class AdminDepartmentDivisionListingsComponent implements OnInit {
    departments: DepartmentDTO[] = [];
    selectedDepartments: DepartmentDTO[] = [];
    loading = false;

    ref: DynamicDialogRef;

    constructor(
        private departmentDataService: DepartmentDataService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private dialogService: DialogService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.loading = true;
        this.departmentDataService.GetAllDepartments().subscribe({
            next: (data: DepartmentDTO[]) => {
                this.departments = data;
                this.loading = false;
                console.log('Departments loaded:', this.departments);
            },
            error: (error) => {
                console.error('Error loading departments:', error);
                this.loading = false;
                this.showError('Failed to load departments');
            },
        });
    }

    showAddDepartmentDialog() {
        this.ref = this.dialogService.open(AdminCreateDepartmentComponent, {
            header: 'Create New Department',
            width: '800px',
            height: '600px',
        });

        this.ref.onClose.subscribe((result) => {
            if (result) {
                this.loadDepartments(); // Refresh the list after adding a new department
            }
        });
    }

    editDepartment(department: DepartmentDTO) {
        this.ref = this.dialogService.open(AdminEditDepartmentComponent, {
            header: `Edit Department - ${department.name}`,
            width: '800px',
            height: '600px',
            data: {
                department: department,
            },
        });

        this.ref.onClose.subscribe((result) => {
            if (result) {
                this.showSuccess(`Department updated successfully!`);
                this.loadDepartments(); // Refresh the list after updating
            }
        });
    }

    deleteDepartment(department: DepartmentDTO) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${department.name}?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // TODO: Implement delete department
                this.showSuccess(
                    `Department ${department.name} deleted successfully`
                );
            },
        });
    }

    addDivision(department: DepartmentDTO) {
        const ref = this.dialogService.open(AdminCreateDivisionComponent, {
            header: `Create New Division for ${department.name}`,
            width: '600px',
            modal: true,
            breakpoints: {
                '960px': '90vw',
                '640px': '95vw',
            },
            data: {
                department: department,
            },
        });

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `Division "${result.division.name}" created successfully!`
                );
                // Refresh the departments to show the new division
                this.loadDepartments();
            }
        });
    }

    editDivision(division: DivisionDTO) {
        // TODO: Implement edit division dialog
        this.showInfo(
            `Edit Division: ${division.name} functionality will be implemented`
        );
    }

    deleteDivision(division: DivisionDTO) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${division.name}?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // TODO: Implement delete division
                this.showSuccess(
                    `Division ${division.name} deleted successfully`
                );
            },
        });
    }

    toggleDivisionStatus(division: any) {
        const action = division.isActive ? 'deactivate' : 'activate';
        this.confirmationService.confirm({
            message: `Are you sure you want to ${action} ${division.name}?`,
            header: `Confirm ${
                action.charAt(0).toUpperCase() + action.slice(1)
            }`,
            icon: 'pi pi-question-circle',
            accept: () => {
                // TODO: Implement toggle division status
                division.isActive = division.isActive ? 0 : 1;
                this.showSuccess(
                    `Division ${division.name} ${action}d successfully`
                );
            },
        });
    }

    // Utility methods for showing messages
    private showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
        });
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
        });
    }

    private showInfo(message: string) {
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: message,
        });
    }
}
