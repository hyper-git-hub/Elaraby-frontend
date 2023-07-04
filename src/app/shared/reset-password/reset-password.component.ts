import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../core/utils/custom.validator';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {HttpController} from '../../core/interceptors/loading-controller';
import {ApiResponse} from '../../core/model/api.response';
import {SwalService} from '../../core/services/swal.service';
import {AppLoader} from '../../core/utils/app-loader';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

/**
 * Reset page, gets called when user clicks on the reset password link sent through email
 */
export class ResetPasswordComponent implements OnInit {


  form: FormGroup;
  token: any;

  showPassword = false;
  showConfirmPassword = false;
  appLoader = new AppLoader();

  // flag that represent whether the token is valid or not
  isValidToken: boolean;

  // current year
  year = (new Date().getFullYear());


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
              private userService: UserService, private swalService: SwalService,
  ) {

    // construct your form
    this.form = this.formBuilder.group({
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: CustomValidators.passwordMatcher // your validation method
      });

    // gets token from route
    this.route.queryParams
      .filter(params => params['reset_password'])
      .subscribe(params => {
        this.token = params.reset_password;
      });
  }

  ngOnInit() {
    this.isValid();

  }

  /**
   * Verify the token sent via email
   */
  isValid() {
    const params = {};
    params['reset_token'] = this.token;
    this.userService.verifyToken(params)
      .subscribe(new class extends HttpController <ApiResponse<any[]>> {
          onComplete(): void {

          }

          onError(errorMessage: string, err: any): void {
            // do
            console.log(errorMessage);
          }

          onNext(apiResponse: ApiResponse<any[]>): void {
            if (apiResponse.status) {
              this.context.isValidToken = true;
            } else {
              this.context.isValidToken = false;
              this.context.swalService.getInfoSwal(apiResponse.message, null);
            }
          }

        }(this)
      );


  }

  /**
   * Gets called when the user submits the form
   */
  onSubmit() {
    this.forgotPassword();
  }


  /**
   * Makes a call with new password & reset token
   */
  forgotPassword() {
    const params = {};
    params['password'] = this.form.value.password;
    params['reset_token'] = this.token;
    this.userService.resetPassword(params)
      .subscribe(new class extends HttpController <ApiResponse<any[]>> {
          onComplete(): void {

          }

          onError(errorMessage: string, err: any) {
            // do
            console.log(errorMessage);

          }

          onNext(apiResponse: ApiResponse<any[]>): void {
            if (apiResponse.status) {
              this.context.swalService.getInfoSwal('Please login again', 2000);
              this.context.authService.unsetUser();
              this.context.router.navigateByUrl('/');

            }
          }

        }(this, this.appLoader)
      );

  }

}
