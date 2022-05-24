import { NgModule } from "@angular/core";
import { AddressPipe } from "./pipes/address.pipe";

@NgModule({
  declarations: [AddressPipe],
  imports: [],
  exports: [AddressPipe]
})
export class SharedModule { }