import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolsInstitutionsComponent } from './schools-institutions.component';

describe('SchoolsInstitutionsComponent', () => {
  let component: SchoolsInstitutionsComponent;
  let fixture: ComponentFixture<SchoolsInstitutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolsInstitutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolsInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
