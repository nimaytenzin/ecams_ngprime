/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StaffUploadResponseLetterComponent } from './staff-upload-response-letter.component';

describe('StaffUploadResponseLetterComponent', () => {
  let component: StaffUploadResponseLetterComponent;
  let fixture: ComponentFixture<StaffUploadResponseLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffUploadResponseLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffUploadResponseLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
