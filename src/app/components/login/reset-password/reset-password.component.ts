import { Component } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

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

  constructor(private snackBar : MatSnackBar) {

  }

  onSubmit() : void {
    this.loading = true;
    if (this.form.password != this.form.repeatPassword){
      this.snackBar.open('Die beiden Felder stimmen nicht überein, bitte nochmal überprüfen!', 'OK', {duration: 5500});
      this.loading = false;
    } else {
      //TODO authService neues Passwort setzen
    }
  }
}
