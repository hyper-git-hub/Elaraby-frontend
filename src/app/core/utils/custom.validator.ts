import {AbstractControl} from '@angular/forms';

export class CustomValidators {

  static isEmail(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value
      .match(/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*/) ? null : {'isEmail': true};
  }
  static passwordStrength(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value
      .match(/^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#\$%\^&\*]{8,}$/) ? null : {'weakPassword': true};
  }
  static passwordMatcher(control: AbstractControl) {

    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (CustomValidators.isEmptyValue(password) || CustomValidators.isEmptyValue(confirmPassword)) {
      return null;
    }

    return password === confirmPassword ? null : {'mismatch': true};
  }
  static samePasswords(control: AbstractControl) {
    const password = control.get('password').value;
    const oldPassword = control.get('oldPassword').value;

    if (CustomValidators.isEmptyValue(password) || CustomValidators.isEmptyValue(oldPassword)) {
      return null;
    }
    return password === oldPassword ?  {'same': true} : null;


    // if (CustomValidators.isEmptyValue(password) || CustomValidators.isEmptyValue(oldPassword)) {
    //   return null;
    // }
    //
    // return password === oldPassword ?  {'same': true}: null;
  }
  static isEmptyValue(value: any) {
    return value === null || typeof value === 'string' && value.length === 0;
  }
  static isAlphabetsAndNumbers(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value
      .match(/^[A-Za-z0-9 \s.,-]+$/) ? null : {'isAlphabetsAndNumbers': true};
  }

  static Elaraby(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value
      .match(/^elaraby+$/) ? null : {'isAlphabetsAndNumbers': true};
  }

  static isContactNumber(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value
      .match(/^[0-9-]+$/) ? null : {'isContactNumber': true};
  }
  static isAlphaNumericSpecial(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value
      .match(/^[A-Za-z0-9- .&#()_,]+$/) ? null : {'isAlphaNumericSpecial': true};
  }
  static isNumbers(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return String(control.value)
      .match(/^[0-9.]+$/) ? null : {'isNumbers': true};
  }
  static isCNIC(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return String(control.value)
      .match(/^[0-9 -]{15,18}$/) ? null : {'isCNIC': true};
  }
  static isEven(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value % 2 == 0 ? null : {'isEven': true};
  }
  static maxLength(length: number, control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value.length < length;
  }
  static max(number: number, control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value > number ? null : {'max': true};
  }
  static greaterThanZero(control: AbstractControl) {

    if (CustomValidators.isEmptyValue(control.value)) {
      return null;
    }

    return control.value > 0 ? null : {'greaterThanZero': true};
  }


}
