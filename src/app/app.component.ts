import {Component, OnInit, Renderer2} from '@angular/core';
import {AuthService} from "./services/AuthService";
import {StorageService} from "./services/StorageService";
import {CsrfService} from "./services/CsrfService";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ThemeService} from "./services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'EventHorizonFrontend';

  constructor(private storageService: StorageService,
              private authService: AuthService,
              private csrfService: CsrfService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private location: Location,
              private themeService : ThemeService) {
  }

  getTheme() {
    return this.themeService.theme;
  }

  ngOnInit(): void {

    this.themeService.theme = this.storageService.getColor();

    if (!this.storageService.getUser() &&
      !this.location.path().includes("newUser") &&
      !this.location.path().includes("register") &&
      !this.location.path().includes("resetpassword") &&
      !this.location.path().includes("impressum") &&
      !this.location.path().includes("login")) {

      this.router.navigate(['/login']);

    }
  }

}
