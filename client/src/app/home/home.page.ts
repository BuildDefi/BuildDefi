import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { appCopyToClipboard } from '../app.functions';
import { AppTranslateService } from '../services/app-translate.service';
import { HamburguerModal } from './hamburguer/hamburger.modal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  constractAddress = environment.contract.address;
  selectedLanguage: string;
  subs: Subscription[] = [];

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private appTranslateService: AppTranslateService
  ) {}

  ngOnInit() {
    this.subs.push(
      this.appTranslateService.selectedLanguage.subscribe(selectedLanguage => {
        this.selectedLanguage = selectedLanguage;
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  async openHamburguer() {
    const modal = await this.modalCtrl.create({
      component: HamburguerModal
    });
    modal.present();
  }

  openTelegram() {
    window.open('https://t.me/builddefi', '_blank');
  }

  copyAddress() {
    appCopyToClipboard(this.toastCtrl, this.constractAddress, 'Endereço copiado com sucesso!');
  }

  setLanguage(language: string) {
    this.appTranslateService.setLanguage(language);
  }
}
