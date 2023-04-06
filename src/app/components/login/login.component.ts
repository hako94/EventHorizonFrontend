import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService";
import {StorageService} from "../../services/StorageService";
import {Router} from "@angular/router";
import {animate, state, style, transition, trigger} from "@angular/animations";

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

  constructor(private authService : AuthService, private storageService : StorageService, private router : Router) {

  }

  onSubmit() : void {
    this.loading = true;

    this.authService.login(this.form.email, this.form.password).subscribe(sucess => {

      this.storageService.saveUser(sucess)
      this.storageService.saveEmail(sucess.email.toString());

      this.router.navigate(['/dashboard']);
    })

  }

}
