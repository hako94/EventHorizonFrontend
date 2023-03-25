import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService";
import {StorageService} from "../../services/Storage";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: any = {
    email: null,
    password: null
  };

  constructor(private authService : AuthService, private storageService : StorageService, private router : Router) {

  }

  onSubmit() : void {

    this.authService.login(this.form.email, this.form.password).subscribe(sucess => {

      this.storageService.saveUser(sucess)
      this.authService.authEmail = sucess.email;

      this.router.navigate(['/dashboard']);
    })

  }

}
