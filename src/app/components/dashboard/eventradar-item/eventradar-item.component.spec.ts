import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventradarItemComponent } from './eventradar-item.component';

describe('EventradarItemComponent', () => {
  let component: EventradarItemComponent;
  let fixture: ComponentFixture<EventradarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventradarItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventradarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
