import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventViewMainComponent } from './event-view-main.component';

describe('EventViewMainComponent', () => {
  let component: EventViewMainComponent;
  let fixture: ComponentFixture<EventViewMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventViewMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventViewMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
