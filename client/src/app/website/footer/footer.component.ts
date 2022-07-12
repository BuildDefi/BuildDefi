import { Component } from "@angular/core";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  openInstagram() {
    window.open('https://www.instagram.com/builddefi/', '_blank');
  }

  openTelegram() {
    window.open('https://t.me/builddefi', '_blank');
  }

  openTwitter() {
    window.open('https://twitter.com/build_defi', '_blank');
  }

  openLinkedIn() {
    window.open('https://www.linkedin.com/company/builddefi', '_blank');
  }
}