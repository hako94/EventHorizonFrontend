import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: any = {
    email: null,
    password: null,
    repeatPassword: null
  };

  loading : boolean = false;

  constructor() {

  }

  onSubmit() : void {
    this.loading = true;

    //authService neues Passwort setzen
  }
}
