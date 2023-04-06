import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/AuthService";
import {StorageService} from "./services/StorageService";
import {CsrfService} from "./services/CsrfService";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {subscribeOn} from "rxjs";

const SESSION_STORAGE_KEY = "auth-user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EventHorizonFrontend';

  constructor(private storageService: StorageService,
              private authService: AuthService,
              private csrfService : CsrfService,
              private router: Router,
              private activeRoute : ActivatedRoute,

              private location : Location) { }

  ngOnInit(): void {

    //TODO: remove session Check from component
    //TODO: safe check
    if (!window.sessionStorage.getItem(SESSION_STORAGE_KEY) &&
        !this.location.path().includes("newUser") &&
        !this.location.path().includes("register")) {

      this.router.navigate(['/login']);

    }

    this.csrfService.getCsrf().subscribe(success => {
      this.storageService.saveCsrfKey(success.token)
    })
  }

  logout(): void {
    this.authService.logout().subscribe(success => {
        this.storageService.clear();
        window.location.reload();
      },
      error => {
        console.log(error);
      }
    );
  }
}
