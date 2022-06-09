import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AppTranslateService {

  private mSelectedLanguage = new BehaviorSubject<string>('pt-br');

  get selectedLanguage(): Observable<string> {
    return this.mSelectedLanguage.asObservable();
  }

  constructor(private translateService: TranslateService) {
    translateService.addLangs(['en', 'pt-br']);
    translateService.setDefaultLang('pt-br');
    translateService.use('pt-br');
  }

  setLanguage(lang: string) {
    this.translateService.use(lang);
    this.mSelectedLanguage.next(lang);
  }
}