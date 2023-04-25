import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSurveyComponent } from './event-survey.component';

describe('EventQuestionairiesComponent', () => {
  let component: EventSurveyComponent;
  let fixture: ComponentFixture<EventSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventSurveyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
