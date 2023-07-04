import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../../core/services/swal.service';
import { UserService } from '../../core/services/user.service';
import { CustomValidators } from '../../core/utils/custom.validator';
import { Router } from '@angular/router';
import { HttpController } from '../../core/interceptors/loading-controller';
import { ApiResponse } from '../../core/model/api.response';
// declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * Login users to system.
 * Provide the functionality of
 * 1)Forgot Password.
 * 2) Log-in a user
 */
export class LoginComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  errorMessages: any;
  year = new Date().getFullYear();
  loginForm: FormGroup;
  errorMessage: string;
  @ViewChild('closeForgotPasswordForm') private closeForgotPasswordForm;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private swalService: SwalService,
    public router: Router) {
    this.forgotPasswordForm = this.formBuilder.group(
      {
        currentEmail: ['', [Validators.required, Validators.email]]
      }
    );
  }

  /**
   * Builds a form
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, CustomValidators.isEmail]],
      password: ['', Validators.required]
    });
    // $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
    //   localStorage.setItem('clientIP', data.geobytesipaddress);
    // });
  }


  /**
   * Gets called when the user submits on forgot password email
   */
  onSubmitForgotPassword() {
    this.closeForgotPasswordForm.nativeElement.click();
    this.forgotPassword();
  }

  /**
   * Makes a call & send email entered to backend
   */
  forgotPassword() {
    const params = {};
    params['email'] = this.forgotPasswordForm.value.currentEmail;
    this.userService.forgotPasword(params)
      .subscribe(new class extends HttpController<ApiResponse<any[]>> {
        onComplete(): void {

        }

        onError(errorMessage: string, err: any) {
          // do
          console.log(errorMessage);

        }

        onNext(apiResponse: ApiResponse<any[]>): void {
          if (apiResponse.status) {
            this.context.swalService.getInfoSwal('Please check you email for further assistance');
          }
        }

      }(this)
      );

  }


}
