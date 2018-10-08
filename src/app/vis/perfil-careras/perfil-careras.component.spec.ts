import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilCarerasComponent } from './perfil-careras.component';

describe('PerfilCarerasComponent', () => {
  let component: PerfilCarerasComponent;
  let fixture: ComponentFixture<PerfilCarerasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilCarerasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilCarerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
