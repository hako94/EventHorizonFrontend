import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/AuthService';
import {HeaderComponent} from "./components/header/header.component";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    authService = TestBed.inject(AuthService);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'EventHorizonFrontend'`, () => {
    const app = fixture.componentInstance;
    expect(app.title).toEqual('EventHorizonFrontend');
  });
});
