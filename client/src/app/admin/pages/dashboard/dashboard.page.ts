import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { ContractService } from "../../services/contract.service";

interface IsPairResult {
  address: string;
  value?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];
  showPairResult = true;
  result: IsPairResult;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      isPairAddress: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  async verifyIsPair() {
    if (this.form.invalid) {
      return;
    }

    const { isPairAddress } = this.form.value;
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.isPair(isPairAddress).subscribe(value => {
      loading.dismiss();
      this.result = { address: isPairAddress, value };
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }

  async toggleIsPair() {
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.setIsPair(this.result.address, !this.result.value).subscribe(() => {
      loading.dismiss();
      this.result.value = !this.result.value;
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }
}