import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService";
import {StorageService} from "../../services/Storage";
import {DataService} from "../../services/DataService";
import {subscribeOn} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: any = {
    email: null,
    password: null
  };

  constructor(private authService: AuthService, private jwtStorage : StorageService, private dataService : DataService) { }

  test(): void {
    this.dataService.privateping().subscribe(success => {
      console.log(success)
    });
  }

  onSubmit(): void {
    const { email, password } = this.form;

    this.authService.register(email, password).subscribe(success => {

        //Auto Login
        this.authService.login(email, password).subscribe(success => {

          this.jwtStorage.saveUser(success)

          console.log(success)
        }, error => {
          console.log(error)
        })
      },
      error => {
        console.log(error)
      }
    );
  }
}
