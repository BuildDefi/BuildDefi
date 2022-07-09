import { ChangeDetectorRef, Component } from "@angular/core";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";

import { Subscription } from "rxjs";
import { appCatchError, appShowLoading } from "../app.functions";
import { ContractService } from "../services/contract.service";

interface Page {
  icon: string;
  name: string;
  url: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
})
export class AdminPage {
  pages: Page[] = [
    {
      icon: 'home',
      name: 'Início',
      url: 'dashboard'
    },
    {
      icon: 'color-wand',
      name: 'Multiplas Transferências',
      url: 'multiple-transfers'
    },
    {
      icon: 'settings',
      name: 'Configurações',
      url: 'settings'
    },
  ];

  selectedUrl = 'dashboard';
  signerAddress: string;
  subs: Subscription[] = [];
  listening = false;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private contractService: ContractService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.menuCtrl.enable(true);

    this.subs.push(
      this.contractService.signerAddress.subscribe(signerAddress => {
        this.signerAddress = signerAddress;
        this.changeDetectorRef.detectChanges();
      })
    );

    this.connectToWallet();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  async navigate(page: Page) {
    this.selectedUrl = page.url;
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot(['/', 'admin', page.url]);
  }

  async website() {
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot(['/']);
  }

  async connectToWallet() {
    const loading = await appShowLoading(this.loadingCtrl);
    loading.message = 'Conectando carteira...';
    this.contractService.connectToWallet().subscribe(provider => {
      loading.dismiss();

      if (!this.listening) {
        this.listening = true;

        provider.on('chainChanged', () => {
          this.connectToWallet();
        });

        provider.on('accountsChanged', () => {
          this.connectToWallet();
        });
      }
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
      this.contractService.clearConnection();
    });
  }
}