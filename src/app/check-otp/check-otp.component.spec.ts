import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOtpComponent } from './check-otp.component';

describe('CheckOtpComponent', () => {
  let component: CheckOtpComponent;
  let fixture: ComponentFixture<CheckOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
