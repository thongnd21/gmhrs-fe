import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Activated2faComponent } from './activated2fa.component';

describe('Activated2faComponent', () => {
  let component: Activated2faComponent;
  let fixture: ComponentFixture<Activated2faComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Activated2faComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Activated2faComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
