import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAutoReplyMailTemplateComponent } from './create-auto-reply-mail-template.component';

describe('CreateAutoReplyMailTemplateComponent', () => {
  let component: CreateAutoReplyMailTemplateComponent;
  let fixture: ComponentFixture<CreateAutoReplyMailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAutoReplyMailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAutoReplyMailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
