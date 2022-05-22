import { Component } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { ContractService } from "./services/contract.service";

interface Page {
  icon: string;
  name: string;
  url: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {
  pages: Page[] = [
    {
      icon: 'home',
      name: 'Início',
      url: ''
    },
  ];

  selectedUrl = '';
  username: string;
  subs: Subscription[] = [];

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private contractService: ContractService
  ) { }

  async ngOnInit() {
    this.menuCtrl.enable(true);

    const balance = await this.contractService.getUserBalance();
    console.log(balance);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    })
  }

  async navigate(page: Page) {
    this.selectedUrl = page.url;
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot(['/', 'dashboard', page.url]);
  }

  async website() {
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot(['/']);
  }
}