import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: 'app-hamburguer',
  templateUrl: './hamburger.modal.html',
  styleUrls: ['./hamburger.modal.scss']
})
export class HamburguerModal {

  constructor(
    private modalCtrl: ModalController
  ) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}