import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSelectorComponent } from './main-selector.component';

describe('MainSelectorComponent', () => {
  let component: MainSelectorComponent;
  let fixture: ComponentFixture<MainSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
