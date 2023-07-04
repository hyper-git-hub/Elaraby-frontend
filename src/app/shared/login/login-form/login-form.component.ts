import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../core/model/user';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiResponseWithHttpStatus } from '../../../core/model/api.response';
import { Router } from '@angular/router';
import { HttpController } from '../../../core/interceptors/loading-controller';
import { UserRoleEnum } from '../../../core/enum/user-role.enum';
import { HttpStatusCodeEnum } from '../../../core/enum/HttpStatusCodeEnum';

/**
 * Login form containing fields for email & password
 */

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string;

  constructor(public formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    public router: Router) {

    // login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  /**
   * Gets called when user clicks on submit button
   * @param formValue
   */
  onSubmit(formValue: Object) {
    // if form is valid
    console.log(formValue);
    if (this.validate()) {
      this.login();
    }
  }

  /**
   * Validate each field of form & return true/false
   */
  validate(): boolean {
    this.errorMessage = null;
    if (this.loginForm.get('email').hasError('required')) {
      this.errorMessage = 'Email is required';
      return false;
    }
    if (this.loginForm.get('email').hasError('isEmail')) {
      this.errorMessage = 'Email is not valid';
      return false;
    }
    if (this.loginForm.get('password').hasError('required')) {
      this.errorMessage = 'Password is required';
      return false;
    }
    return true;
  }

  /**
   * Makes call & send form value for the user to login
   */
  login(): void {
    this.userService.login(this.loginForm.value as User)
      .subscribe(new class extends HttpController<ApiResponseWithHttpStatus<User>> {
        onComplete(): void {
        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);
          this.context.errorMessage = errorMessage;
        }

        onNext(apiResponse: ApiResponseWithHttpStatus<User>): void {
          console.log(apiResponse);
          if (apiResponse.status) {
            if (apiResponse.status === HttpStatusCodeEnum.Success) {
              this.context.authService.setUser(apiResponse.response as User);
              const user = this.context.authService.getUser();
              this.context.redirect(user);
            } else if (apiResponse.status === HttpStatusCodeEnum.Error) {
              this.context.errorMessage = apiResponse.message;
              this.context.authService.unsetUser();
            }
          }
        }
      }(this)
      );
  }

  /**
   * Redirectes user to respective module
   * @param user: user objects returned by the login call
   */

  redirect(user) {
    console.log("redirect To== ", user);

    if (user.user_role_id === UserRoleEnum.User) {
      console.log("---unauthorized---");
      this.router.navigate(['unauthorized']);
    } else {
      console.log("---navigate to IOP dashboard---");

      if (user.user_role_name == 'Admin') {
        this.router.navigate(['/iop']);
      } else {
        this.router.navigate(['/iop/qr-generator']);
      }

    }
  }


}
