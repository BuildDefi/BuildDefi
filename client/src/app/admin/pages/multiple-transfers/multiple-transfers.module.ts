import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.module";
import { MultipleTransfersPage } from './multiple-transfers.page';

const routes: Routes = [
  {
    path: '',
    component: MultipleTransfersPage
  }
];

@NgModule({
  declarations: [MultipleTransfersPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class MultipleTransfersPageModule { }