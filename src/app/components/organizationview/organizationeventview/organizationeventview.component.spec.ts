import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationeventviewComponent } from './organizationeventview.component';

describe('OrganizationeventviewComponent', () => {
  let component: OrganizationeventviewComponent;
  let fixture: ComponentFixture<OrganizationeventviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationeventviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationeventviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
