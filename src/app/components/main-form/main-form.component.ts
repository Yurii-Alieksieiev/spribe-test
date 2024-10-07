import {Component, OnInit} from "@angular/core";
import {FormItemComponent} from "../form-item/form-item.component";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {CustomValidators} from "../../shared/validators/custom-validators";
import {UserService} from "../../services/user.service";
import {filter, Observable, Subject, switchMap, takeUntil, takeWhile, timer} from "rxjs";
import {map} from "rxjs/operators";
import {FormService} from "../../services/form.service";
import {FormData} from "../../shared/interface/form-data.interface";

@Component({
  selector: 'app-main-form',
  standalone: true,
  imports: [
    FormItemComponent,
    ReactiveFormsModule,
    NgForOf,
    NgOptimizedImage,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.scss'
})
export class MainFormComponent implements OnInit {
  private stop$ = new Subject<boolean>();
  formGroup: FormGroup;

  timer$!: Observable<number>;

  constructor(
    private _fb: FormBuilder,
    private readonly _userService: UserService,
    private readonly _formService: FormService,
  ) {
    this.formGroup = this._fb.group({
      formGroupArray: this._fb.array([])
    })
  }

  ngOnInit() {
    this.addFormItem();
  }

  get formGroupList() {
    return (this.formGroup.get('formGroupArray') as FormArray).controls as FormGroup[];
  }

  addFormItem() {
    this.formGroupList.push(
      this._fb.group({
        country: new FormControl(null, [Validators.required, CustomValidators.country]),
        username: new FormControl(null, [Validators.required], [CustomValidators.username(this._userService)]),
        birthday: new FormControl(null, [Validators.required, CustomValidators.birthday]),
      })
    );
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();

    if (this.errorsCount) {
      return;
    }

    this.formGroup.disable()

    this.startTimer();

    this.timer$.pipe(
      filter((v) => v === 0),
      switchMap(() => {
        return this._formService.submitForm(this.getFormValues());
      })
    ).subscribe(() => {
      this.formGroup.enable();
      this.clearFormValues();
    })
  }

  onDeleteFormGroup(index: number) {
    this.formGroupList.splice(index, 1);
  }

  get isDisabled() {
   return this.formGroupList.length === 0 || this.isPending || !!this.errorsCount;
  }

  get isPending() {
    let isPending = false;
    this.formGroupList.forEach((formGroup: FormGroup) => {
      Object.keys(formGroup.controls).forEach(key => {
        if (formGroup.controls[key].pending) {
          isPending = true;
        }
      })
    })

    return isPending;
  }

  get errorsCount() {
    let errorsCounter = 0;
    this.formGroupList.forEach((formGroup: FormGroup) => {
      Object.keys(formGroup.controls).forEach(key => {
        if (
            (!formGroup.controls[key].pristine || formGroup.controls[key].touched)
            && formGroup.controls[key].errors
            && !formGroup.controls[key].pending
        ) {
          errorsCounter++;
        }
      })
    })

    return errorsCounter;
  }

  onCancel() {
    this.stopTimer()
    this.formGroup.enable();
  }

  stopTimer() {
    this.stop$.next(true);
  }

  startTimer() {
    this.timer$ = timer(0, 1000).pipe(
      map(n => 5 - n),
      takeUntil(this.stop$),
      takeWhile((n) => n >= 0),
    );
  }

  getFormValues() {
    let formValues: FormData = {};
    this.formGroupList.map((formGroup: FormGroup, index: number) => {
      formValues = {
        ...formValues,
        [index]: formGroup.value
      };
    })

    return formValues;
  }

  clearFormValues() {
    this.formGroupList.forEach((formGroup: FormGroup) => {
      formGroup.markAsUntouched({ onlySelf: true });
      formGroup.markAsPristine({ onlySelf: true });
      formGroup.updateValueAndValidity({ onlySelf: true, emitEvent: false })
      Object.keys(formGroup.controls).forEach(key => {
        formGroup.controls[key].setValue(null, { emitEvent: false });
      })
    })
  }
}
