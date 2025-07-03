import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffViewLetterComponent } from './view-letter/staff-view-letter/staff-view-letter.component';
import { StaffListLettersComponent } from './list-letters/staff-list-letters/staff-list-letters.component';
import { StaffUploadLetterComponent } from './staff-upload-letter/staff-upload-letter.component';

const routes: Routes = [
    {
        path: '',
        component: StaffListLettersComponent,
    },
    {
        path: 'view/:letterId',
        component: StaffViewLetterComponent,
    },
    {
        path: 'upload',
        component: StaffUploadLetterComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StaffLettersRoutingModule {}
