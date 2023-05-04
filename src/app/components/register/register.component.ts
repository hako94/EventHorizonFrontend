import {Component} from '@angular/core';
import {AuthService} from "../../services/AuthService";
import {StorageService} from "../../services/StorageService";
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
    password: null,
    firstname: null,
    lastname: null
  };

  withOrganizationId: boolean;
  withNewUser: boolean;
  organization: string;
  preparedEmail: string;
  inviteId: string;

  constructor(private authService: AuthService,
              private jwtStorage: StorageService,
              private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router) {

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

      if (this.preparedEmail != "undefined") {
        this.form.email = this.preparedEmail;
      }
    });

    console.log("test" + this.organization + this.inviteId)

    this.authService.checkInvite(this.withNewUser, this.organization, this.inviteId).pipe().subscribe(() => {
    }, () => {
      this.router.navigate(['/login'], {
        queryParams: {
        }
      });
    })

    console.log("withOrganizationId:" + this.withOrganizationId + " - newUser: " + this.withNewUser)
  }


  test(): void {
    this.dataService.privatePing().subscribe(success => {
      console.log(success)
    });
  }

  onSubmit(): void {
    if (this.withOrganizationId) {

      this.authService.registerWithLink(
        this.form.email,
        this.form.password,
        this.form.firstname,
        this.form.lastname,
        this.preparedEmail,
        this.organization,
        this.inviteId).subscribe(success => {

          //Auto Login
          this.authService.login(this.form.email, this.form.password).subscribe(success => {

            this.jwtStorage.saveUser(success)
            this.jwtStorage.saveUserId(success.id.toString());
            this.jwtStorage.saveEmail(success.email.toString());
            this.jwtStorage.saveOrganizationList(success.organizations);
            this.jwtStorage.savePlattformAdmin(success.plattformAdmin)

            this.router.navigate(['/dashboard']);

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
            this.jwtStorage.saveUserId(success.id.toString());
            this.jwtStorage.saveEmail(success.email.toString());
            this.jwtStorage.saveOrganizationList(success.organizations);
            this.jwtStorage.savePlattformAdmin(success.plattformAdmin)

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

  answerInvitation(answer: string) {
    this.authService.answerOrgInvite(
      this.form.email,
      this.preparedEmail,
      this.organization,
      this.inviteId,
      answer).subscribe(success => {
        this.router.navigate(['/login'], {
          queryParams: {
          }
        });
      },
      error => {
        console.log(error)
        this.router.navigate(['/login'], {
          queryParams: {
          }
        });
      }
    );
  }
}
