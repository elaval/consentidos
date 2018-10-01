import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniquadComponent } from './miniquad.component';

describe('MiniquadComponent', () => {
  let component: MiniquadComponent;
  let fixture: ComponentFixture<MiniquadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniquadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniquadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
