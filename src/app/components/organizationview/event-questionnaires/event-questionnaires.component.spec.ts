import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventQuestionnairesComponent } from './event-questionnaires.component';

describe('EventQuestionnairesComponent', () => {
  let component: EventQuestionnairesComponent;
  let fixture: ComponentFixture<EventQuestionnairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventQuestionnairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventQuestionnairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
