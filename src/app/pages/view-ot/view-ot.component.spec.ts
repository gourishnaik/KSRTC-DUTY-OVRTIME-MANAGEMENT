import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOtComponent } from './view-ot.component';

describe('ViewOtComponent', () => {
  let component: ViewOtComponent;
  let fixture: ComponentFixture<ViewOtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
