import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFaAuthComponent } from './two-fa-auth.component';

describe('TwoFaAuthComponent', () => {
  let component: TwoFaAuthComponent;
  let fixture: ComponentFixture<TwoFaAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoFaAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFaAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
