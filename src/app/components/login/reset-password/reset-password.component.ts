import {Component} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {AuthService} from "../../../services/AuthService";
import {ActivatedRoute, Router} from "@angular/router";

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
  loading: boolean = false;
  preparedEmail: string;

  constructor(private snackBar: MatSnackBar, private location: Location, private authService: AuthService,
              private route: ActivatedRoute, private router: Router
  ) {
    this.preparedEmail = "";

    this.route.queryParams.subscribe(params => {

      this.preparedEmail = decodeURIComponent(params['email']);

      if (this.preparedEmail != "undefined") {
        this.form.email = this.preparedEmail;
      }
    });

  }

  onSubmit(): void {
    this.loading = true;
    if (this.form.password != this.form.repeatPassword) {
      this.snackBar.open('Die beiden Felder stimmen nicht überein, bitte nochmal überprüfen!', 'OK', {duration: 5500});
      this.loading = false;
    } else if (!this.form.password || !this.form.repeatPassword) {
      this.snackBar.open('Alle Felder müssen ausgefüllt sein!', 'OK', {duration: 3500});
      this.loading = false;
    } else {
      let resetToken = this.location.path().split('token=')[1].split('&')[0];
      if (resetToken) {
        this.authService.resetPassword(this.form.email, resetToken, this.form.password).pipe().subscribe(() => {
          this.snackBar.open('Passwort erfolgreich zurückgesetzt!', 'OK', {duration: 3500});
          this.router.navigate(['/login']);
        }, error => {
          console.log(error)
        });
      }
    }
  }
}
