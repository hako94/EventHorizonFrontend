import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventUserMangamentComponent } from './event-user-mangament.component';

describe('EventUserMangamentComponent', () => {
  let component: EventUserMangamentComponent;
  let fixture: ComponentFixture<EventUserMangamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventUserMangamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventUserMangamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
