import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {httpInterceptorProviders} from "./components/interceptors/test";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
    ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
