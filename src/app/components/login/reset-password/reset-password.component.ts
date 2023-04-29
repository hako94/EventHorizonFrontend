import { Component } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {AuthService} from "../../../services/AuthService";

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

  constructor(private snackBar : MatSnackBar, private location : Location, private authService : AuthService) {

  }

  onSubmit() : void {
    this.loading = true;
    if (this.form.password != this.form.repeatPassword){
      this.snackBar.open('Die beiden Felder stimmen nicht überein, bitte nochmal überprüfen!', 'OK', {duration: 5500});
      this.loading = false;
    } else if (!this.form.password || !this.form.repeatPassword){
      this.snackBar.open('Alle Felder müssen ausgefüllt sein!', 'OK', {duration: 3500});
      this.loading = false;
    } else {
      let resetToken = this.location.path().split('=').at(1)?.toString();
      if (resetToken){
        this.authService.resetPassword(this.form.email, resetToken, this.form.password);
      }
    }
  }
}
