import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { AppTranslateService } from "src/app/services/app-translate.service";

@Component({
  selector: 'app-hamburguer',
  templateUrl: './hamburger.modal.html',
  styleUrls: ['./hamburger.modal.scss']
})
export class HamburguerModal {

  selectedLanguage: string;
  subs: Subscription[] = [];

  constructor(
    private modalCtrl: ModalController,
    private appTranslateService: AppTranslateService
  ) { }

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

  dismiss() {
    this.modalCtrl.dismiss();
  }

  setLanguage(language: string) {
    this.appTranslateService.setLanguage(language);
  }

  openWhitepaper() {
    window.open('https://docs.builddefi.io/welcome-to-gitbook/IkiBzVcXsOCld75Zdf6L/', '_blank');
    this.modalCtrl.dismiss();
  }

  scrollTo(type: string) {
    this.modalCtrl.dismiss(type, 'scroll');
  }
}