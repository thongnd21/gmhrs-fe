import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyConfigConnectionComponent } from './company-config-connection.component';

describe('CompanyConfigConnectionComponent', () => {
  let component: CompanyConfigConnectionComponent;
  let fixture: ComponentFixture<CompanyConfigConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyConfigConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyConfigConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
