import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { ContractService } from "src/app/services/contract.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {

  balance = 0;
  quotes = 0;
  subs: Subscription[] = [];

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.contractService.signerAddress.subscribe(async signerAddress => {
        if (signerAddress) {
          const loading = await appShowLoading(this.loadingCtrl);
          this.contractService.balanceOf(signerAddress).subscribe(balance => {
            loading.dismiss();
            this.balance = balance;
            this.quotes = Math.floor(balance / 100000);
          }, error => {
            loading.dismiss();
            appCatchError(this.alertCtrl)(error);
          });
        }
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
}