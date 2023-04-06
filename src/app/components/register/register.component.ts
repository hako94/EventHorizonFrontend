import { Component } from '@angular/core';
import {AuthService} from "../../services/AuthService";
import {StorageService} from "../../services/Storage";
import {DataService} from "../../services/DataService";
import {ActivatedRoute, Router} from "@angular/router";

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

  withOrganizationId : boolean;
  withNewUser : boolean;
  organization : string;
  preparedEmail : string;
  inviteId : string;

  constructor(private authService: AuthService,
              private jwtStorage : StorageService,
              private dataService : DataService,
              private route: ActivatedRoute,
              private router : Router) {

    this.withOrganizationId = false;
    this.withNewUser = true;
    this.organization = "";
    this.preparedEmail = "";
    this.inviteId = "";

    this.route.queryParams.subscribe(params => {

      console.log("found newUser" + params['newUser'])

      if (params['newUser'] == 'false') {
        this.withNewUser = false;
        //TODO: Check session.isalive
      }

      this.organization = params['OrganizationId']
      if (this.organization) {
        this.withOrganizationId = true;
      }
      this.preparedEmail = decodeURIComponent(params['UserIdEmail']);
      this.inviteId = params['createdUserModel'];

      console.log("Email " + this.preparedEmail)

      if (this.preparedEmail != "undefined"){
        this.form.email = this.preparedEmail;
      }
    });

    console.log("withOrganizationId:" + this.withOrganizationId + " - newUser: " + this.withNewUser)
  }


  test(): void {
    this.dataService.privatePing().subscribe(success => {
      console.log(success)
    });
  }

  onSubmit(): void {
    if (this.withOrganizationId) {
      const {email, password} = this.form;

      this.authService.registerWithLink(
        email,
        password,
        "EinVorname",
        "EinNachname",
        this.preparedEmail,
        this.organization,
        this.inviteId).subscribe(success => {

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
    } else {
      const {email, password} = this.form;

      this.authService.register(email, password).subscribe(success => {

          //Auto Login
          this.authService.login(email, password).subscribe(success => {

            this.jwtStorage.saveUser(success)
            this.jwtStorage.saveEmail(success.email.toString());

            console.log(success)

            this.router.navigate(['/dashboard']);

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
}
