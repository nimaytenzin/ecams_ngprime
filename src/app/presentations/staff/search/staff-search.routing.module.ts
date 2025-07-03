import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffSearchLettersComponent } from './staff-search-letters/staff-search-letters.component';

const routes: Routes = [
    {
        path: '',
        component: StaffSearchLettersComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StaffSearchRoutingModule {}
