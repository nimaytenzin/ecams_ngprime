import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { LetterDataService } from 'src/app/core/dataservice/Letter/letter.dataservice';
import { LetterDTO } from 'src/app/core/dataservice/Letter/letter.dto';

@Component({
    selector: 'app-staff-search-letters',
    templateUrl: './staff-search-letters.component.html',
    styleUrls: ['./staff-search-letters.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextModule,
        ButtonModule,
        TagModule,
    ],
})
export class StaffSearchLettersComponent implements OnInit {
    searchString: string;
    matchingLetters: LetterDTO[];
    constructor(
        private router: Router,
        private letterDataService: LetterDataService
    ) {}

    ngOnInit() {}
    search() {
        if (this.searchString) {
            this.letterDataService
                .FuzzySearchLetters(this.searchString)
                .subscribe({
                    next: (res) => {
                        this.matchingLetters = res;
                    },
                });
        }
    }

    viewLetter(letterId: number) {
        this.router.navigate(['/staff/letter/view', letterId]);
    }
}
