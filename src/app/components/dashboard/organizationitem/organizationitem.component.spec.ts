import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationitemComponent } from './organizationitem.component';

describe('OrganizationitemComponent', () => {
  let component: OrganizationitemComponent;
  let fixture: ComponentFixture<OrganizationitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
