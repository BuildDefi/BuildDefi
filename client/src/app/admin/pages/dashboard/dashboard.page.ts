import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { ContractService } from "../../services/contract.service";

interface Result {
  address: string;
  value?: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {

  dexForm: FormGroup;
  effForm: FormGroup;
  subs: Subscription[] = [];
  showPairResult = true;
  dexResult: Result;
  effResult: Result;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.dexForm = new FormGroup({
      address: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });

    this.effForm = new FormGroup({
      address: new FormControl(null, {
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
    if (this.dexForm.invalid) {
      return;
    }

    const { address } = this.dexForm.value;
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.isPair(address).subscribe(value => {
      loading.dismiss();
      this.dexResult = { address, value };
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }

  async toggleIsPair() {
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.setIsPair(this.dexResult.address, !this.dexResult.value).subscribe(() => {
      loading.dismiss();
      this.dexResult.value = !this.dexResult.value;
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }

  async verifyIsExcludedFromFee() {
    if (this.effForm.invalid) {
      return;
    }

    const { address } = this.effForm.value;
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.isExcludedFromFee(address).subscribe(value => {
      loading.dismiss();
      this.effResult = { address, value };
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }

  async toggleIsExcludedFromFee() {
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.setIsExcludedFromFee(this.effResult.address, !this.effResult.value).subscribe(() => {
      loading.dismiss();
      this.effResult.value = !this.effResult.value;
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }
}