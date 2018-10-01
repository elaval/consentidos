import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoInstitucionPanelComponent } from './tipo-institucion-panel.component';

describe('TipoInstitucionPanelComponent', () => {
  let component: TipoInstitucionPanelComponent;
  let fixture: ComponentFixture<TipoInstitucionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoInstitucionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoInstitucionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
