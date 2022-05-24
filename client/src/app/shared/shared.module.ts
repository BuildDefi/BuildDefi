import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { HeaderComponent } from "./components/header/header.component";
import { ResponsiveComponent } from "./components/responsive/responsive.component";
import { AddressPipe } from "./pipes/address.pipe";

@NgModule({
  declarations: [
    AddressPipe,
    HeaderComponent,
    ResponsiveComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    AddressPipe,
    HeaderComponent,
    ResponsiveComponent
  ]
})
export class SharedModule { }