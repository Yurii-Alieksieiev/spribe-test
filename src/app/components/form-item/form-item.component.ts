import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Country} from "../../shared/enum/country";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {debounceTime, distinctUntilChanged, of, Subscription, switchMap} from "rxjs";
import {ClickOutsideDirective} from "../../shared/directives/click-outside.directive";
import {CheckValidityDirective} from "../../shared/directives/check-validity.directive";
import {NgbDateParserFormatter, NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {DateParserFormatter} from "../../shared/utils/date-parser-formatter";

@Component({
  selector: 'app-form-item',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ClickOutsideDirective,
    CheckValidityDirective,
    NgbDatepickerModule,
    FormsModule,
    NgOptimizedImage
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
  ],
  templateUrl: './form-item.component.html',
  styleUrl: './form-item.component.scss'
})
export class FormItemComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() index!: number;
  @Output() delete = new EventEmitter<number>();

  optionsList: string[] = Object.values(Country);
  searchedOptions: string[] = [];
  showDropdown = false;

  countryInputSub$!: Subscription;

  ngOnInit() {
    this.countryInputSub$ = this.formGroup.controls['country'].valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      switchMap((searchStr) => searchStr ? this.getOptions(searchStr) : of([]))
    ).subscribe((searchedOptions: string[]) => {
      if (!this.formGroup.controls['country'].disabled && searchedOptions.length > 0) {
        this.showDropdown = true;
        this.searchedOptions = searchedOptions;
        return;
      }

      this.showDropdown = false;
    })
  }

  ngOnDestroy() {
    this.countryInputSub$.unsubscribe();
  }

  getOptions(searchStr: string) {
    return of(this.filterOptions(searchStr))
  }

  filterOptions(searchStr: string) {
    return this.optionsList.filter((val: any) => val.toLowerCase().includes(searchStr.toLowerCase()));
  }

  setSelectedOption(option: any) {
    this.searchedOptions = this.filterOptions(option);
    this.formGroup.controls['country'].setValue(option, { emitEvent: false });
    this.closeDropdown();
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  onDeleteClick() {
    this.delete.emit(this.index);
  }
}
