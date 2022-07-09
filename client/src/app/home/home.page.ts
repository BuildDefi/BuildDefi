import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { appCopyToClipboard } from '../app.functions';
import { AppTranslateService } from '../services/app-translate.service';
import { HamburguerModal } from './hamburguer/hamburger.modal';

declare var particlesJS: any;
declare var window: { open: any, innerHeight: number };

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('content', { static: true }) ionContent: any;
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

    setTimeout(() => {
      particlesJS.load('particles-js', 'assets/particles.json');
    }, 500);

    console.log(window.innerHeight);
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

    const res = await modal.onDidDismiss();

    if (res.role === 'scroll') {
      this.scrollTo(res.data);
    }
  }

  openTelegram() {
    window.open('https://t.me/builddefi', '_blank');
  }

  openWhitepaper() {
    window.open('https://docs.builddefi.io/welcome-to-gitbook/IkiBzVcXsOCld75Zdf6L/', '_blank');
  }

  copyAddress() {
    appCopyToClipboard(this.toastCtrl, this.constractAddress, 'Endereço copiado com sucesso!');
  }

  setLanguage(language: string) {
    this.appTranslateService.setLanguage(language);
  }

  scrollTo(type: string) {
    const height = window.innerHeight - 70;
    switch (type) {
      case 'home':
        this.ionContent.scrollToPoint(0, height * 0);
        break;
      case 'features':
        this.ionContent.scrollToPoint(0, height * 1);
        break;
      case 'roadmap':
        this.ionContent.scrollToPoint(0, height * 2);
        break;
      case 'about':
        this.ionContent.scrollToPoint(0, height * 3);
        break;
    }
  }
}
