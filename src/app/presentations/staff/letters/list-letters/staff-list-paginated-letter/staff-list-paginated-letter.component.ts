import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ASSET_URL } from 'src/app/core/constants/constants';
import { LetterDTO } from 'src/app/core/dataservice/Letter/letter.dto';

@Component({
    selector: 'app-staff-list-paginated-letter',
    templateUrl: './staff-list-paginated-letter.component.html',
    styleUrls: ['./staff-list-paginated-letter.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        PaginatorModule,
        TagModule,
    ],
})
export class StaffListPaginatedLetterComponent implements OnInit {
    @Input() title = 'Letters';
    @Input() getPaginatedLettersFn!: (
        page: number,
        size: number
    ) => Promise<any>;

    paginatedLetters = { data: [], count: 0 };
    rows = 10;
    firstPageNumber = 0;
    rowsPerPageOptions = [5, 10, 20];

    constructor(private router: Router) {}

    ngOnInit() {
        this.fetchLetters();
    }

    async fetchLetters(page = 0) {
        const res = await this.getPaginatedLettersFn(page, this.rows);
        this.paginatedLetters = res;
        this.firstPageNumber = page * this.rows;
    }

    onPageChange(event: any) {
        this.rows = event.rows;
        this.fetchLetters(event.page);
    }

    getStaffImgUrl(url: string) {
        return {
            backgroundImage: `url(${ASSET_URL}/${url})`,
            height: '3rem',
            width: '3rem',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        };
    }
    viewLetter(letter: LetterDTO) {
        this.router.navigate(['/staff/letter/view', letter.id]);
    }

    getTaT(letter: LetterDTO): string | void {
        const { createdAt, closingDate, isClosed } = letter;

        if (!createdAt) return;

        const created = new Date(createdAt).getTime();
        const closed = isClosed ? new Date(closingDate).getTime() : Date.now();

        if (isNaN(created) || isNaN(closed)) return;

        const diffDays = Math.abs(
            Math.round((closed - created) / (1000 * 60 * 60 * 24))
        );

        const label = isClosed ? 'TAT' : 'ET';

        return `${label}: ${diffDays <= 1 ? '1 day' : `${diffDays} days`}`;
    }
}
