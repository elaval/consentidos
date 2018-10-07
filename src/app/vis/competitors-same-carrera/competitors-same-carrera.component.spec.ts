import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorsSameCarreraComponent } from './competitors-same-carrera.component';

describe('CompetitorsSameCarreraComponent', () => {
  let component: CompetitorsSameCarreraComponent;
  let fixture: ComponentFixture<CompetitorsSameCarreraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitorsSameCarreraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorsSameCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
