import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "../shared/shared.module";
import { DashboardPage } from "./dashboard.page";

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DashboardPageModule { }