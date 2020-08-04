import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEmailTemplateComponent } from './assign-email-template.component';

describe('AssignEmailTemplateComponent', () => {
  let component: AssignEmailTemplateComponent;
  let fixture: ComponentFixture<AssignEmailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEmailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
