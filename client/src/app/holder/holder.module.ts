import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.module";
import { HolderPage } from "./holder.page";

const routes: Routes = [
  {
    path: '',
    component: HolderPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [HolderPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HolderPageModule { }