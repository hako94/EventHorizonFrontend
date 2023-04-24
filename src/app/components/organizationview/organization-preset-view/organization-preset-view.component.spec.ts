import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationPresetViewComponent } from './organization-preset-view.component';

describe('OrganizationPresetViewComponent', () => {
  let component: OrganizationPresetViewComponent;
  let fixture: ComponentFixture<OrganizationPresetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationPresetViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationPresetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
