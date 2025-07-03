import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
        ReactiveFormsModule,
    ],
    providers: [DialogService, MessageService],
})
export class StaffUploadLetterComponent implements OnInit {
    letterForm: FormGroup;
    departments: DepartmentDTO[] = [];
    divisions: DivisionDTO[] = [];
    dzongkhags: DzongkhagDTO[] = [];
    fileLocationCategories: FilelocationCategoryDTO[] = [];
    fileLocations: FileLocationDTO[] = [];

    modes = [
        { label: 'Incoming Letter', value: 'IN' },
        { label: 'Outgoing Letter', value: 'OUT' },
    ];

    letterFile: File | null = null;
    attachments: any[] = [];
    newAttachment: any = {};
    attachmentFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private dialogService: DialogService,
        private letterService: LetterDataService,
        private dzongkhagDataService: DzongkhagDataService,
        private departmentDataService: DepartmentDataService,
        private divisionDataService: DivisionDataService,
        private folderStorageDataService: FolderStorageDataService
    ) {
        this.dzongkhags = this.dzongkhagDataService.dzongkhags;
        this.initializeForm();
    }

    ngOnInit(): void {
        this.loadInitialData();
    }

    private initializeForm(): void {
        this.letterForm = this.fb.group({
            basicDetails: this.fb.group({
                subject: ['', Validators.required],
                letterHead: ['', Validators.required],
                direction: ['IN', Validators.required],
            }),
            recipientDetails: this.fb.group({
                outRecipient: ['', Validators.required],
                outLetterHead: ['', Validators.required],
                outOffice: ['', Validators.required],
                outDepartment: ['', Validators.required],
                outDivision: ['', Validators.required],
                outDzongkhag: [this.dzongkhags, Validators.required],
            }),
            departmentDetails: this.fb.group({
                departmentId: ['', Validators.required],
                divisionId: ['', Validators.required],
            }),
            storageDetails: this.fb.group({
                archivalFolderCategoryId: ['', Validators.required],
                archivalFolderId: ['', Validators.required],
            }),
            fileUpload: this.fb.control(null, Validators.required),
        });
    }

    private loadInitialData(): void {
        this.folderStorageDataService.GetAllFileLocationCategories().subscribe({
            next: (res) => {
                this.fileLocationCategories = res;
                this.letterForm
                    .get('storageDetails.archivalFolderCategoryId')
                    ?.patchValue(res[0]?.id);
                this.onFolderCategoryChange();
            },
            error: () => this.showNetworkError(),
        });

        this.departmentDataService.GetAllDepartments().subscribe({
            next: (res) => {
                this.departments = res;

                this.onDepartmentChange();
            },
            error: () => this.showNetworkError(),
        });
    }

    onDepartmentChange(): void {
        const departmentId = this.letterForm.get(
            'departmentDetails.departmentId'
        )?.value;
        if (departmentId) {
            this.divisionDataService
                .GetDivisionsByDepartment(departmentId)
                .subscribe({
                    next: (res) => {
                        this.divisions = res;
                        this.letterForm
                            .get('departmentDetails.divisionId')
                            ?.patchValue(res[0]?.id);
                    },
                    error: () => this.showNetworkError(),
                });
        }
    }

    onFolderCategoryChange(): void {
        const categoryId = this.letterForm.get(
            'storageDetails.archivalFolderCategoryId'
        )?.value;
        if (categoryId) {
            this.folderStorageDataService
                .GetAllFileLocationsByCategory(categoryId)
                .subscribe({
                    next: (res) => {
                        this.fileLocations = res;
                        this.letterForm
                            .get('storageDetails.archivalFolderId')
                            ?.patchValue(res[0]?.id);
                    },
                    error: () => this.showNetworkError(),
                });
        }
    }

    onLetterFileSelect(event: any): void {
        const file = event.files?.[0];
        if (file) {
            this.letterFile = file;
            this.letterForm.get('fileUpload')?.setValue(file);
        }
    }

    uploadLetter(): void {
        if (this.letterForm.invalid) {
            this.markAllAsTouched();
            this.showError('Please fill in all required fields');
            return;
        }

        if (!this.letterFile) {
            this.showError('Please select a file to upload');
            return;
        }

        const formValue = this.letterForm.value;
        const letterData: CreateLetterDTO = {
            creatorId: Number(sessionStorage.getItem('userId')),
            direction: formValue.basicDetails.direction,
            subject: formValue.basicDetails.subject,
            letterHead: formValue.basicDetails.letterHead,
            ...formValue.recipientDetails,
            departmentId: formValue.departmentDetails.departmentId,
            divisionId: formValue.departmentDetails.divisionId,
            archivalFolderId: formValue.storageDetails.archivalFolderId,
            archivalFolderCategoryId:
                formValue.storageDetails.archivalFolderCategoryId,
            isDraft: 0,
            isClosed: 0,
            fileUri: '',
        };

        console.log('CREATING NEW LETTER', letterData);
        this.letterService.CreateNewLetter(letterData).subscribe({
            next: (createdLetter) => {
                console.log(createdLetter);
                this.uploadLetterFile(createdLetter);
            },
            error: () => this.showNetworkError(),
        });
    }

    private markAllAsTouched(): void {
        Object.values(this.letterForm.controls).forEach((control) => {
            if (control instanceof FormGroup) {
                Object.values(control.controls).forEach((subControl) => {
                    subControl.markAsTouched();
                });
            } else {
                control.markAsTouched();
            }
        });
    }

    private uploadLetterFile(letter: any): void {
        if (!this.letterFile) return;

        const formData = new FormData();
        formData.append('file', this.letterFile);

        // this.letterService.UploadLetterFile(letter.id, formData).subscribe({
        //     next: () => {
        //         this.showSuccess('Letter uploaded successfully');
        //         this.letterForm.reset();
        //         this.letterFile = null;
        //         // Reset to initial state
        //         this.initializeForm();
        //         this.loadInitialData();
        //     },
        //     error: () => this.showNetworkError(),
        // });
    }

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

    get isOutgoingLetter(): boolean {
        return this.letterForm.get('basicDetails.direction')?.value === 'OUT';
    }
}
