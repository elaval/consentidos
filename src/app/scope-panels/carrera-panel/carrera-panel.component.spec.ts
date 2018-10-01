import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraPanelComponent } from './carrera-panel.component';

describe('CarreraPanelComponent', () => {
  let component: CarreraPanelComponent;
  let fixture: ComponentFixture<CarreraPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarreraPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarreraPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
