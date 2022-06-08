import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HamburguerModal } from './hamburguer/hamburger.modal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private modalCtrl: ModalController
  ) {}

  async openHamburguer() {
    const modal = await this.modalCtrl.create({
      component: HamburguerModal
    });
    modal.present();
  }
}
