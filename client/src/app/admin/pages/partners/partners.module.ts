import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.module";
import { PartnersPage } from "./partners.page";

const routes: Routes = [
  {
    path: '',
    component: PartnersPage
  }
];

@NgModule({
  declarations: [PartnersPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class PartnersPageModule { }