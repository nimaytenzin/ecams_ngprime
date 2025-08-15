import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { DepartmentDataService } from 'src/app/core/dataservice/Department/department.dataservice';
import { DepartmentDTO } from 'src/app/core/dataservice/Department/department.dto';
import { DivisionDataService } from 'src/app/core/dataservice/Division/division.dataservice';
import { DivisionDTO } from 'src/app/core/dataservice/Division/division.dto';
import { DzongkhagDataService } from 'src/app/core/dataservice/Dzongkhag/dzongkhag.dataservice';
import { DzongkhagDTO } from 'src/app/core/dataservice/Dzongkhag/dzongkhag.dto';
import { FolderStorageDataService } from 'src/app/core/dataservice/Folder Storage/folder.storage.dataservice';
import {
    FilelocationCategoryDTO,
    FileLocationDTO,
} from 'src/app/core/dataservice/Folder Storage/folder.storage.dto';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { CreateLetterDTO } from 'src/app/core/dataservice/Letter/letter.dto';
import { StaffForwardLetterModalComponent } from './components/staff-forward-letter-modal/staff-forward-letter-modal.component';
import { StaffAttachmentModalComponent } from './components/staff-attachment-modal/staff-attachment-modal.component';
import { StaffActionModalComponent } from './components/staff-action-modal/staff-action-modal.component';
import { StaffCloseLetterModalComponent } from './components/staff-close-letter-modal/staff-close-letter-modal.component';

// Step enums
enum UploadStep {
    MODE_SELECTION = 1,
    LETTER_DETAILS = 2,
    SENDER_RECIPIENT = 3,
    INTERNAL_ROUTING = 4,
    STORAGE = 5,
    FILE_SELECTION = 6,
    READY_TO_UPLOAD = 7,
}

@Component({
    selector: 'app-staff-upload-letter',
    templateUrl: './staff-upload-letter.component.html',
    styleUrls: ['./staff-upload-letter.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        CheckboxModule,
        ToastModule,
        ReactiveFormsModule,
        DividerModule,
        FileUploadModule,
        TabViewModule,
        CardModule,
        InputTextareaModule,
        TagModule,
    ],
    providers: [DialogService, MessageService],
})
export class StaffUploadLetterComponent implements OnInit {
    // Step management
    currentStep = UploadStep.MODE_SELECTION;
    UploadStep = UploadStep;

    // Forms
    modeForm!: FormGroup;
    letterDetailsForm!: FormGroup;
    senderRecipientForm!: FormGroup;
    internalRoutingForm!: FormGroup;
    storageForm!: FormGroup;

    // Data
    selectedMode: 'IN' | 'OUT' | null = null;
    departments: DepartmentDTO[] = [];
    divisions: DivisionDTO[] = [];
    dzongkhags: DzongkhagDTO[] = [];
    fileLocationCategories: FilelocationCategoryDTO[] = [];
    fileLocations: FileLocationDTO[] = [];

    // File handling
    letterFile: File | null = null;

    // Loading states
    loadingDepartments = false;
    loadingDivisions = false;
    loadingFileLocations = false;
    uploading = false;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private dialogService: DialogService,
        private router: Router,
        private letterService: LetterDataService,
        private dzongkhagDataService: DzongkhagDataService,
        private departmentDataService: DepartmentDataService,
        private divisionDataService: DivisionDataService,
        private folderStorageDataService: FolderStorageDataService
    ) {
        this.initializeForms();
    }

    ngOnInit(): void {
        this.loadInitialData();
    }

    private initializeForms(): void {
        // Step 1: Mode selection
        this.modeForm = this.fb.group({
            direction: ['', Validators.required],
        });

        // Step 2: Letter details
        this.letterDetailsForm = this.fb.group({
            subject: ['', Validators.required],
            letterHead: ['', Validators.required],
        });

        // Step 3: Sender/Recipient details
        this.senderRecipientForm = this.fb.group({
            outRecipient: ['', Validators.required],
            outOffice: ['', Validators.required],
            outDepartment: ['', Validators.required],
            outDivision: ['', Validators.required],
            outDzongkhag: ['', Validators.required],
        });

        // Step 4: Internal routing
        this.internalRoutingForm = this.fb.group({
            department: ['', Validators.required],
            division: ['', Validators.required],
        });

        // Step 5: Storage
        this.storageForm = this.fb.group({
            archivalFolderCategoryId: ['', Validators.required],
            archivalFolder: ['', Validators.required],
        });
    }

    private loadInitialData(): void {
        // Load Dzongkhags
        this.dzongkhags = this.dzongkhagDataService.dzongkhags;

        // Load Departments
        this.loadingDepartments = true;
        this.departmentDataService.GetAllDepartments().subscribe({
            next: (res) => {
                this.departments = res;
                this.loadingDepartments = false;
            },
            error: () => {
                this.showNetworkError();
                this.loadingDepartments = false;
            },
        });

        // Load File Location Categories
        this.folderStorageDataService.GetAllFileLocationCategories().subscribe({
            next: (res) => {
                this.fileLocationCategories = res;
            },
            error: () => this.showNetworkError(),
        });
    }

    // Step 1: Mode Selection
    selectMode(mode: 'IN' | 'OUT'): void {
        this.selectedMode = mode;
        this.modeForm.patchValue({ direction: mode });
        this.currentStep = UploadStep.LETTER_DETAILS;
    }

    changeModeSelection(): void {
        this.currentStep = UploadStep.MODE_SELECTION;
        this.selectedMode = null;
        this.modeForm.reset();
    }

    // Step 2: Letter Details
    proceedToSenderRecipient(): void {
        if (this.letterDetailsForm.valid) {
            this.currentStep = UploadStep.SENDER_RECIPIENT;
        } else {
            this.markFormGroupTouched(this.letterDetailsForm);
            this.showError('Please fill in all required fields');
        }
    }

    // Step 3: Sender/Recipient
    proceedToInternalRouting(): void {
        if (this.senderRecipientForm.valid) {
            this.currentStep = UploadStep.INTERNAL_ROUTING;
        } else {
            this.markFormGroupTouched(this.senderRecipientForm);
            this.showError('Please fill in all required fields');
        }
    }

    // Step 4: Internal Routing
    onDepartmentChange(): void {
        const department = this.internalRoutingForm.get('department')?.value;
        if (department?.id) {
            this.loadingDivisions = true;
            this.divisionDataService
                .GetDivisionsByDepartment(department.id)
                .subscribe({
                    next: (res) => {
                        this.divisions = res;
                        this.loadingDivisions = false;
                        if (res.length > 0) {
                            this.internalRoutingForm.patchValue({
                                division: res[0],
                            });
                        }
                    },
                    error: () => {
                        this.showNetworkError();
                        this.loadingDivisions = false;
                    },
                });
        }
    }

    proceedToStorage(): void {
        if (this.internalRoutingForm.valid) {
            this.currentStep = UploadStep.STORAGE;
        } else {
            this.markFormGroupTouched(this.internalRoutingForm);
            this.showError('Please fill in all required fields');
        }
    }

    // Step 5: Storage
    onFolderCategoryChange(): void {
        const category = this.fileLocationCategories.find(
            (c) =>
                c.id === this.storageForm.get('archivalFolderCategoryId')?.value
        );

        if (category?.filelocations) {
            this.fileLocations = category.filelocations;
            if (this.fileLocations.length > 0) {
                this.storageForm.patchValue({
                    archivalFolder: this.fileLocations[0],
                });
            }
        }
    }

    proceedToFileSelection(): void {
        if (this.storageForm.valid) {
            this.currentStep = UploadStep.FILE_SELECTION;
        } else {
            this.markFormGroupTouched(this.storageForm);
            this.showError('Please fill in all required fields');
        }
    }

    // Step 6: File Selection
    onLetterFileSelect(event: any): void {
        const file = event.files?.[0];
        if (file) {
            this.letterFile = file;
            this.currentStep = UploadStep.READY_TO_UPLOAD;
        }
    }

    removeFile(): void {
        this.letterFile = null;
        this.currentStep = UploadStep.FILE_SELECTION;
    }

    // Step 7: Upload Letter
    uploadLetter(): void {
        if (!this.isAllRequiredFieldsFilled()) {
            this.showError('Please complete all required steps');
            return;
        }

        if (!this.letterFile) {
            this.showError('Please select a file to upload');
            return;
        }

        this.uploading = true;

        const letterData: CreateLetterDTO = {
            creatorId: Number(sessionStorage.getItem('userId')),
            dealerId: Number(sessionStorage.getItem('userId')),
            direction: this.selectedMode!,
            subject: this.letterDetailsForm.value.subject,
            letterHead: this.letterDetailsForm.value.letterHead,
            ...this.senderRecipientForm.value,
            departmentId: this.internalRoutingForm.value.department.id,
            divisionId: this.internalRoutingForm.value.division.id,
            archivalFolderId: this.storageForm.value.archivalFolder.id,
            archivalFolderCategoryId:
                this.storageForm.value.archivalFolderCategoryId,
            isDraft: 0,
            isClosed: 0,
            fileUri: '',
        };

        // Create letter first
        this.letterService.CreateNewLetter(letterData).subscribe({
            next: (createdLetter) => {
                this.uploadLetterFile(createdLetter);
            },
            error: () => {
                this.showNetworkError();
                this.uploading = false;
            },
        });
    }

    private uploadLetterFile(letter: any): void {
        if (!this.letterFile) return;

        const formData = new FormData();
        formData.append('file', this.letterFile);

        const year = letter.year || new Date().getFullYear();
        const department = this.internalRoutingForm.value.department;
        const division = this.internalRoutingForm.value.division;
        const folder = this.storageForm.value.archivalFolder;

        this.letterService
            .UploadLetterToArchive(
                department.abbreviation,
                division.abbreviation,
                folder.name,
                year,
                letter.id,
                formData
            )
            .subscribe({
                next: (response) => {
                    this.uploading = false;
                    this.showSuccess('Letter uploaded to archive successfully');

                    // Open attachments modal
                    this.openAttachmentsModal(letter);
                },
                error: (error) => {
                    console.error('Error uploading letter to archive:', error);
                    this.showNetworkError();
                    this.uploading = false;
                },
            });
    }

    // Validation helpers
    private isAllRequiredFieldsFilled(): boolean {
        return (
            this.modeForm.valid &&
            this.letterDetailsForm.valid &&
            this.senderRecipientForm.valid &&
            this.internalRoutingForm.valid &&
            this.storageForm.valid &&
            this.letterFile !== null
        );
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    // Navigation helpers
    goToStep(step: UploadStep): void {
        // Only allow going to previous steps or current step
        if (step <= this.currentStep) {
            this.currentStep = step;
        }
    }

    canGoToStep(step: UploadStep): boolean {
        switch (step) {
            case UploadStep.MODE_SELECTION:
                return true;
            case UploadStep.LETTER_DETAILS:
                return this.selectedMode !== null;
            case UploadStep.SENDER_RECIPIENT:
                return (
                    this.selectedMode !== null && this.letterDetailsForm.valid
                );
            case UploadStep.INTERNAL_ROUTING:
                return (
                    this.selectedMode !== null &&
                    this.letterDetailsForm.valid &&
                    this.senderRecipientForm.valid
                );
            case UploadStep.STORAGE:
                return (
                    this.selectedMode !== null &&
                    this.letterDetailsForm.valid &&
                    this.senderRecipientForm.valid &&
                    this.internalRoutingForm.valid
                );
            case UploadStep.FILE_SELECTION:
                return (
                    this.selectedMode !== null &&
                    this.letterDetailsForm.valid &&
                    this.senderRecipientForm.valid &&
                    this.internalRoutingForm.valid &&
                    this.storageForm.valid
                );
            case UploadStep.READY_TO_UPLOAD:
                return this.isAllRequiredFieldsFilled();
            default:
                return false;
        }
    }

    // Modal methods (to be implemented)
    private openAttachmentsModal(letter: any): void {
        const ref = this.dialogService.open(StaffAttachmentModalComponent, {
            header: 'Letter Attachments',
            width: '600px',
            data: {
                letterId: letter.id,
                letterReference: letter.letterHead,
                letterSubject: letter.subject,
            },
        });

        ref.onClose.subscribe((result) => {
            if (result?.success) {
                this.showSuccess(
                    `Proceeded with ${
                        result.attachmentCount || 0
                    } attachment(s)`
                );
                this.openActionModal(letter);
            }
        });
    }

    private openActionModal(letter: any): void {
        const ref = this.dialogService.open(StaffActionModalComponent, {
            header: 'Choose Action',
            width: '600px',
            data: {
                letterId: letter.id,
                letterReference: letter.letterHead,
                letterSubject: letter.subject,
            },
        });

        ref.onClose.subscribe((result) => {
            if (result?.action === 'forward') {
                this.onOpenForwardModal(letter.id);
            } else if (result?.action === 'close') {
                this.onOpenCloseModal(letter.id);
            } else if (result?.action === 'skip') {
                // Navigate directly to view letter page
                this.navigateToViewLetter(letter.id);
            }
        });
    }

    // Utility methods
    private showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000,
        });
    }

    private showSuccess(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
        });
    }

    private showNetworkError(): void {
        this.showError('Network error occurred. Please try again.');
    }

    // Getters for template
    get isOutgoingLetter(): boolean {
        return this.selectedMode === 'OUT';
    }

    get isIncomingLetter(): boolean {
        return this.selectedMode === 'IN';
    }

    get currentStepTitle(): string {
        switch (this.currentStep) {
            case UploadStep.MODE_SELECTION:
                return 'Select Letter Direction';
            case UploadStep.LETTER_DETAILS:
                return 'Letter Details';
            case UploadStep.SENDER_RECIPIENT:
                return this.isOutgoingLetter
                    ? 'To | Recipient'
                    : 'From | Sender';
            case UploadStep.INTERNAL_ROUTING:
                return 'Department / Division';
            case UploadStep.STORAGE:
                return 'Storage Location';
            case UploadStep.FILE_SELECTION:
                return 'Select Letter File';
            case UploadStep.READY_TO_UPLOAD:
                return 'Ready to Upload';
            default:
                return '';
        }
    }

    // Modal methods for after successful upload
    onOpenForwardModal(letterId: number): void {
        const ref = this.dialogService.open(StaffForwardLetterModalComponent, {
            header: 'Forward Letter',
            data: { letterId },
        });

        ref.onClose.subscribe((result) => {
            if (result?.success) {
                this.showSuccess('Letter forwarded successfully');
                // Navigate to view letter page
                this.navigateToViewLetter(letterId);
            }
        });
    }

    onOpenCloseModal(letterId: number): void {
        const ref = this.dialogService.open(StaffCloseLetterModalComponent, {
            header: 'Close Letter',

            data: { letterId },
        });

        ref.onClose.subscribe((result) => {
            if (result?.success) {
                this.showSuccess('Letter closed successfully');
                // Navigate to view letter page
                this.navigateToViewLetter(letterId);
            }
        });
    }

    onOpenAttachmentsModal(letterId: number): void {
        // This can be implemented for managing attachments
        // For now, just show a confirmation
        this.showSuccess('Attachments modal functionality will be implemented');
    }

    private navigateToViewLetter(letterId: number): void {
        // Add a small delay to allow the success message to be seen
        setTimeout(() => {
            this.router.navigate(['/staff/letter/view', letterId]);
        }, 1500);
    }
}
