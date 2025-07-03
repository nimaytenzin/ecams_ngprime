import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { StaffListPaginatedLetterComponent } from '../staff-list-paginated-letter/staff-list-paginated-letter.component';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { AuthService } from 'src/app/core/dataservice/User/auth.service';

@Component({
    selector: 'app-staff-list-letters',
    templateUrl: './staff-list-letters.component.html',
    styleUrls: ['./staff-list-letters.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        DividerModule,
        ButtonModule,
        TabViewModule,
        StaffListPaginatedLetterComponent,
    ],
})
export class StaffListLettersComponent implements OnInit {
    constructor(
        private letterDataService: LetterDataService,
        private authService: AuthService
    ) {}

    ngOnInit() {}

    getAllLettersPaginated = async (page: number, size: number) => {
        const queryParams: any = {
            pageNo: page,
            pageSize: size,
        };

        const res = await this.letterDataService
            .GetAllLettersByDepartmentPaginated(
                this.authService.GetAuthenticatedUser().department.id,
                queryParams
            )
            .toPromise();

        return res;
    };

    getAllPendingLettersPaginated = async (page: number, size: number) => {
        const queryParams: any = {
            pageNo: page,
            pageSize: size,
        };

        const res = await this.letterDataService
            .GetAllPendingLettersByDepartmentPaginated(
                this.authService.GetAuthenticatedUser().department.id,
                queryParams
            )
            .toPromise();

        return res;
    };

    getAllResolvedLettersPaginated = async (page: number, size: number) => {
        const queryParams: any = {
            pageNo: page,
            pageSize: size,
        };

        const res = await this.letterDataService
            .GetAllResolvedLettersByDepartmentPaginated(
                this.authService.GetAuthenticatedUser().department.id,
                queryParams
            )
            .toPromise();

        return res;
    };
}
