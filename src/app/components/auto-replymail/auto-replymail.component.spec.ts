import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReplymailComponent } from './auto-replymail.component';

describe('AutoReplymailComponent', () => {
  let component: AutoReplymailComponent;
  let fixture: ComponentFixture<AutoReplymailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoReplymailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReplymailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
