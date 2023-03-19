import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/AuthService";
import {StorageService} from "./services/Storage";
import {CsrfService} from "./services/CsrfService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'EventHorizonFrontend';
  isLoggedIn = false;

  constructor(private storageService: StorageService, private authService: AuthService, private csrfService : CsrfService) { }

  ngOnInit(): void {
    this.csrfService.getCsrf().subscribe(success => {
      this.storageService.saveCsrfKey(success.token)
    })

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
    }
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
