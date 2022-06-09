import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AppTranslateService {

  private mSelectedLanguage = new BehaviorSubject<string>(null);

  get selectedLanguage(): Observable<string> {
    return this.mSelectedLanguage.asObservable().pipe(
      take(1),
      map(selectedLanguage => {
        const fromStorage = localStorage.getItem('selectedLanguage');

        if (!selectedLanguage && fromStorage) {
          this.translateService.use(fromStorage);
          this.mSelectedLanguage.next(fromStorage);
        } else if (!selectedLanguage) {
          this.translateService.use('pt-br');
          this.mSelectedLanguage.next('pt-br');
          localStorage.setItem('selectedLanguage', 'pt-br');
        }
      }),
      switchMap(() => {
        return this.mSelectedLanguage.asObservable();
      })
    );
  }

  constructor(private translateService: TranslateService) {
    translateService.addLangs(['en', 'pt-br']);
    translateService.setDefaultLang('pt-br');
  }

  setLanguage(language: string) {
    this.translateService.use(language);
    this.mSelectedLanguage.next(language);
    localStorage.setItem('selectedLanguage', language);
  }
}