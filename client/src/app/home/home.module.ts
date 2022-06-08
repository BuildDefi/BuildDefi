import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { RouterModule, Routes } from '@angular/router';
import { HamburguerModal } from './hamburguer/hamburger.modal';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage, HamburguerModal]
})
export class HomePageModule {}
