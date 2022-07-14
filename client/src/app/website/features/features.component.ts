import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { BecomeModal } from "../partners/become/become.modal";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent {

  constructor(
    private modalCtrl: ModalController
  ) { }

  openPancakeSwap() {
    window.open(`https://pancakeswap.finance/swap?outputCurrency=${environment.contract.address}`, '_blank');
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BecomeModal
    });
    modal.present();
  }
}