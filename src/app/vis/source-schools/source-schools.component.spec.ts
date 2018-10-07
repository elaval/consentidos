import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceSchoolsComponent } from './source-schools.component';

describe('SourceSchoolsComponent', () => {
  let component: SourceSchoolsComponent;
  let fixture: ComponentFixture<SourceSchoolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceSchoolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
