import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.module";
import { DashboardPage } from "./dashboard.page";

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  }
];

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ]
})
export class DashboardPageModule { }