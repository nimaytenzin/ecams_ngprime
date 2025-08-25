import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffLetterArchiveListingsComponent } from './staff-letter-archive-listings/staff-letter-archive-listings.component';

const routes: Routes = [
    {
        path: '',
        component: StaffLetterArchiveListingsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StaffArchiveRoutingModule {}
