import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService } from '../../services/DataService';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { OrganizationModel } from "../../models/OrganizationModel";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dataServiceMock: { getOrganizations: jest.Mock<any, any, any> };

  const organizations: OrganizationModel[] = [
    {
      id: '1',
      name: 'Organization 1',
      description: 'Description 1',
      logoId: 'logo1'
    },
    {
      id: '2',
      name: 'Organization 2',
      description: 'Description 2',
      logoId: 'logo2'
    },
    {
      id: '3',
      name: 'Organization 3',
      description: 'Description 3',
      logoId: 'logo3'
    }
  ];

  beforeEach(() => {
    dataServiceMock = {
      getOrganizations: jest.fn().mockReturnValue(of(organizations))
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: DataService, useValue: dataServiceMock }]
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set organizations on init', () => {
    component.ngOnInit();
    expect(component.organizations).toEqual(organizations);
    expect(dataServiceMock.getOrganizations).toHaveBeenCalled();
  });
});
