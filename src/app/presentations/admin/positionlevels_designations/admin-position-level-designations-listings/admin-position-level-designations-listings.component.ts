import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PositionDataService } from 'src/app/core/dataservice/Position/position.dataservice';
import { DesignationDataService } from 'src/app/core/dataservice/Designation/designation.dataservice';
import { PositionDTO } from 'src/app/core/dataservice/Position/position.dto';
import { DesignationDTO } from 'src/app/core/dataservice/Designation/designation.dto';
import { AdminPositionDialogComponent } from '../admin-position-dialog/admin-position-dialog.component';
import { AdminDesignationDialogComponent } from '../admin-designation-dialog/admin-designation-dialog.component';

@Component({
    selector: 'app-admin-position-level-designations-listings',
    templateUrl: './admin-position-level-designations-listings.component.html',
    styleUrls: ['./admin-position-level-designations-listings.component.css'],
    providers: [MessageService, DialogService],
})
export class AdminPositionLevelDesignationsListingsComponent implements OnInit {
    positions: PositionDTO[] = [];
    designations: DesignationDTO[] = [];
    loadingPositions = false;
    loadingDesignations = false;

    constructor(
        private positionService: PositionDataService,
        private designationService: DesignationDataService,
        private messageService: MessageService,
        private dialogService: DialogService
    ) {}

    ngOnInit() {
        this.loadPositions();
        this.loadDesignations();
    }

    loadPositions() {
        this.loadingPositions = true;
        this.positionService.GetAllPositions().subscribe({
            next: (positions) => {
                this.positions = positions.sort(
                    (a, b) => a.hierarchical_level - b.hierarchical_level
                );
                this.loadingPositions = false;
            },
            error: (error) => {
                console.error('Error loading positions:', error);
                this.showError('Failed to load positions');
                this.loadingPositions = false;
            },
        });
    }

    loadDesignations() {
        this.loadingDesignations = true;
        this.designationService.GetAllDesignations().subscribe({
            next: (designations) => {
                this.designations = designations.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                this.loadingDesignations = false;
            },
            error: (error) => {
                console.error('Error loading designations:', error);
                this.showError('Failed to load designations');
                this.loadingDesignations = false;
            },
        });
    }

    refresh() {
        this.loadPositions();
        this.loadDesignations();
    }

    // Position Management
    addPosition() {
        const ref = this.dialogService.open(AdminPositionDialogComponent, {
            header: 'Create New Position',
            width: '500px',
            modal: true,
            breakpoints: {
                '960px': '90vw',
                '640px': '95vw',
            },
        });

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `Position "${result.position.name}" ${result.action}d successfully!`
                );
                this.loadPositions();
            }
        });
    }

    editPosition(position: PositionDTO) {
        const ref = this.dialogService.open(AdminPositionDialogComponent, {
            header: `Edit Position: ${position.name}`,
            width: '500px',
            modal: true,
            breakpoints: {
                '960px': '90vw',
                '640px': '95vw',
            },
            data: {
                position: position,
            },
        });

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `Position "${result.position.name}" ${result.action}d successfully!`
                );
                this.loadPositions();
            }
        });
    }

    // Designation Management
    addDesignation() {
        const ref = this.dialogService.open(AdminDesignationDialogComponent, {
            header: 'Create New Designation',
            width: '450px',
            modal: true,
            breakpoints: {
                '960px': '90vw',
                '640px': '95vw',
            },
        });

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `Designation "${result.designation.name}" ${result.action}d successfully!`
                );
                this.loadDesignations();
            }
        });
    }

    editDesignation(designation: DesignationDTO) {
        const ref = this.dialogService.open(AdminDesignationDialogComponent, {
            header: `Edit Designation: ${designation.name}`,
            width: '450px',
            modal: true,
            breakpoints: {
                '960px': '90vw',
                '640px': '95vw',
            },
            data: {
                designation: designation,
            },
        });

        ref.onClose.subscribe((result) => {
            if (result && result.success) {
                this.showSuccess(
                    `Designation "${result.designation.name}" ${result.action}d successfully!`
                );
                this.loadDesignations();
            }
        });
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000,
        });
    }

    private showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
        });
    }
}
