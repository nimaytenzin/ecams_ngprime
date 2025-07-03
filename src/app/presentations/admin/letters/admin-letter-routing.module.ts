import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewLetterComponent } from './admin-view-letter/admin-view-letter.component';

const routes: Routes = [
    {
        path: '/:letterId',
        component: AdminViewLetterComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminLetterRoutingModule {}
