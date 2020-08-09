import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAutoReplyMailTemplateComponent } from './detail-auto-reply-mail-template.component';

describe('DetailAutoReplyMailTemplateComponent', () => {
  let component: DetailAutoReplyMailTemplateComponent;
  let fixture: ComponentFixture<DetailAutoReplyMailTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAutoReplyMailTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAutoReplyMailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
