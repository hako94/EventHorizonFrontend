import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService";
import {StorageService} from "../../services/StorageService";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        width: '115px',
        opacity: 1,
      })),
      state('closed', style({
        width: '100px',
        opacity: 0.8,
      })),
      transition('open => closed', [
        animate('0.1s')
      ]),
      transition('closed => open', [
        animate('0.1s')
      ]),
    ]),
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: any = {
    email: null,
    password: null
  };

  loading : boolean = false;

  params? : Params;

  constructor(private authService : AuthService,
              private storageService : StorageService,
              private router : Router,
              private route: ActivatedRoute,
              private snackBar : MatSnackBar) {

    this.route.queryParams.subscribe(data => {

      this.params = data;

    })
  }

  onSubmit() : void {
    this.loading = true;

    this.authService.login(this.form.email, this.form.password).subscribe(sucess => {

      this.storageService.saveUser(sucess);
      this.storageService.saveUserId(sucess.id.toString());
      this.storageService.saveEmail(sucess.email.toString());
      this.storageService.saveOrganizationList(sucess.organizations);
      this.storageService.savePlattformAdmin(sucess.plattformAdmin)

      if (this.params) {
        if (this.params['locationToRedirectAfterLogin']) {
          console.log(this.params['orgId'] + " sdsd " + this.params['eventId'])
          if (this.params['orgId'] && this.params['eventId']) {
            console.log("redirecting ...")
            this.router.navigate(['/organizations/' + this.params['orgId'] + '/event/' + this.params['eventId'] + '/details'], { queryParams: { view: 'description' } })
          } else {
            console.log("standard login3")
            this.router.navigate(['/dashboard']);
          }
        } else {
          console.log("standard login2")
          this.router.navigate(['/dashboard']);
        }
      } else {
        console.log("standard login1")
        this.router.navigate(['/dashboard']);
      }
    }, error => {
      this.snackBar.open('Die eingegebenen Zugangsdaten sind nicht korrekt', 'OK', {duration: 5000});
      this.loading = false;
    })

  }

  forgotPassword(email: string): void{
    console.log('upsi');
    if (this.form.email == ''){
      this.snackBar.open('Bitte Email eingeben', 'OK', {duration: 3500});
    } else {
      this.snackBar.open('Eine Mail zum Zurücketzen wird gesendet...', 'OK', {duration: 300});
      this.authService.sendResetEmail(email).subscribe(success => {
        this.snackBar.open('Sie haben eine Email mit einem Link zum Zurücksetzen ihres Passworts erhalten', 'OK', {duration: 5000});
      }, error => {
          this.snackBar.open('Es ist ein Fehler aufgetreten', 'OK', {duration: 3000});
      }
      );
    }
  }

    protected readonly onkeydown = onkeydown;
}
