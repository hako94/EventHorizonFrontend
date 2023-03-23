import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEventViewComponent } from './organization-event-view.component';

describe('OrganizationeventviewComponent', () => {
  let component: OrganizationEventViewComponent;
  let fixture: ComponentFixture<OrganizationEventViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationEventViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationEventViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
