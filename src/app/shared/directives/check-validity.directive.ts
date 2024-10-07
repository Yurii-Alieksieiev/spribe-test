import {Directive, ElementRef, AfterViewChecked, Input} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[appCheckValidity]',
})
export class CheckValidityDirective implements AfterViewChecked {
  @Input() controlName!: string;
  private errorElement!: HTMLElement;

  constructor(
    private control: NgControl,
    private host: ElementRef<HTMLElement>
  ) {
  }

  ngAfterViewChecked() {
    if ((!this.control.pristine || this.control.touched) && this.control.invalid) {
      this.element.classList.add(`is-invalid`);
      this.append();
    } else {
      this.element.classList.remove(`is-invalid`);
      this.hide();
    }
  }

  private append() {
    if (this.errorElement) {
      this.errorElement.style.display = 'block';
    } else {
      this.errorElement = document.createElement('div');
      this.errorElement.classList.add('invalid-feedback');

      this.element.parentNode?.appendChild(this.errorElement);
    }
    if (this.resolveError(this.control.errors)) {
      this.errorElement.innerText = this.resolveError(this.control.errors);
    }
  }

  private hide() {
    if (this.errorElement) {
      this.errorElement.style.display = 'none';
    }
  }

  get element() {
    return this.host.nativeElement;
  }

  resolveError(errors: any) {
    return Object.keys(errors)[0] ? `Please provide a correct ${this.controlName}` : '';
  }
}
