import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./pages/main/main.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
