import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { BecomeModal } from "./become/become.modal";

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent {

  constructor(
    private modalCtrl: ModalController
  ) { }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: BecomeModal
    });
    modal.present();
  }
}