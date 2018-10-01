import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucionPanelComponent } from './institucion-panel.component';

describe('InstitucionPanelComponent', () => {
  let component: InstitucionPanelComponent;
  let fixture: ComponentFixture<InstitucionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitucionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
