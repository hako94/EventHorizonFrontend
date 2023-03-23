import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAddeventComponent } from './organization-addevent.component';

describe('OrganizationAddeventComponent', () => {
  let component: OrganizationAddeventComponent;
  let fixture: ComponentFixture<OrganizationAddeventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationAddeventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationAddeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
