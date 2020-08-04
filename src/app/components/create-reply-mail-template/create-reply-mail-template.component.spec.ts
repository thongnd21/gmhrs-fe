import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReplyMailTemplateComponent } from './create-reply-mail-template.component';

describe('CreateReplyMailTemplateComponent', () => {
  let component: CreateReplyMailTemplateComponent;
  let fixture: ComponentFixture<CreateReplyMailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateReplyMailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReplyMailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
