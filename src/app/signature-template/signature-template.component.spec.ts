import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureTemplateComponent } from './signature-template.component';

describe('SignatureTemplateComponent', () => {
  let component: SignatureTemplateComponent;
  let fixture: ComponentFixture<SignatureTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignatureTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
