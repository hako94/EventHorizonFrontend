import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationmemberviewComponent } from './organizationmemberview.component';

describe('OrganizationmemberviewComponent', () => {
  let component: OrganizationmemberviewComponent;
  let fixture: ComponentFixture<OrganizationmemberviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationmemberviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationmemberviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
