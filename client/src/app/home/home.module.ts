import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { RouterModule, Routes } from '@angular/router';
import { HamburguerModal } from './hamburguer/hamburger.modal';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { FeaturesComponent } from './features/features.component';
import { AboutComponent } from './about/about.component';
import { TokenComponent } from './token/token.component';
import { FooterComponent } from './footer/footer.component';
import { PartnersComponent } from './partners/partners.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { BecomeModal } from './partners/become/become.modal';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [
    HomePage,
    HamburguerModal,
    BecomeModal,
    FeaturesComponent,
    AboutComponent,
    TokenComponent,
    FooterComponent,
    PartnersComponent,
    RoadmapComponent
  ]
})
export class HomePageModule {}
