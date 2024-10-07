import {Component} from '@angular/core';
import {MainFormComponent} from "../../components/main-form/main-form.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MainFormComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
