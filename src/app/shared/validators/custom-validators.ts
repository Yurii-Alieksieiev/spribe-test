import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {Country} from "../enum/country";
import {Observable, take} from "rxjs";
import {map} from "rxjs/operators";
import {UserService} from "../../services/user.service";

export class CustomValidators {

  static country(control: AbstractControl): { [p: string]: any } | null {
    if (control.value) {
      return Country[control.value as Country] ? null : { invalidCountry: true };
    }

    return null;
  }

  static username(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return userService
        .checkUsername(control.value)
        .pipe(
          take(1),
          map(({ isAvailable }) => {
            return isAvailable ? null : { isAvailable: false }
          })
        );
    };
  }

  static birthday(control: AbstractControl): { [p: string]: any } | null {
    if (control.value) {
      const {day, month, year} = control.value;
      const todayDate = new Date().setHours(0, 0, 0, 0);
      const selectedDate = new Date(year, month - 1, day).getTime();
      return selectedDate <= todayDate ? null : { invalidBirthday: true };
    }

    return null;
  }
}
