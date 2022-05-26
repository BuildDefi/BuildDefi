import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { TokenInfo } from "../../models/token-info.model";
import { ContractService } from "../../services/contract.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];
  info: TokenInfo;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.subs.push(
      this.contractService.tokenInfo.subscribe(info => {
        this.info = info;

        if (info) {
          this.form = new FormGroup({
            feeDenominator: new FormControl(info.feeDenominator, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            burnFeePurchase: new FormControl(info.burnFeePurchase, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            burnFeeSale: new FormControl(info.burnFeeSale, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            developerFeePurchase: new FormControl(info.developerFeePurchase, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            developerFeeSale: new FormControl(info.developerFeeSale, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            holderFeePurchase: new FormControl(info.holderFeePurchase, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            holderFeeSale: new FormControl(info.holderFeeSale, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            liquidityFeePurchase: new FormControl(info.liquidityFeePurchase, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            liquidityFeeSale: new FormControl(info.liquidityFeeSale, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
            developerAddress: new FormControl(info.developerAddress, {
              updateOn: 'change',
              validators: [Validators.required, Validators.pattern(/^0x([0-9]|[a-f]|[A-F]){40}$/)]
            }),
            holderAddress: new FormControl(info.holderAddress, {
              updateOn: 'change',
              validators: [Validators.required, Validators.pattern(/^0x([0-9]|[a-f]|[A-F]){40}$/)]
            }),
            liquidityAddress: new FormControl(info.liquidityAddress, {
              updateOn: 'change',
              validators: [Validators.required, Validators.pattern(/^0x([0-9]|[a-f]|[A-F]){40}$/)]
            }),
            holdLimit: new FormControl(+`${info.holdLimit}` / 10, {
              updateOn: 'change',
              validators: [Validators.required]
            }),
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

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const {
      burnFeePurchase, burnFeeSale,
      developerFeePurchase, developerFeeSale,
      holderFeePurchase, holderFeeSale,
      liquidityFeePurchase, liquidityFeeSale,
      developerAddress, holderAddress,
      liquidityAddress, feeDenominator,
      holdLimit
    } = this.form.value;

    const changed = {};

    Object.keys(this.form.value).forEach(prop => {
      if (this.info[prop] !== this.form.value[prop]) {
        changed[prop] = true;
      }
    });

    if (changed['feeDenominator']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setFeeDenominator(feeDenominator).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['burnFeePurchase'] || changed['burnFeeSale']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setBurnFee(burnFeePurchase, burnFeeSale).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['developerFeePurchase'] || changed['developerFeeSale']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setDeveloperFee(developerFeePurchase, developerFeeSale).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['holderFeePurchase'] || changed['holderFeeSale']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setHolderFee(holderFeePurchase, holderFeeSale).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['liquidityFeePurchase'] || changed['liquidityFeeSale']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setLiquidityFee(liquidityFeePurchase, liquidityFeeSale).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['developerAddress']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setDeveloperAddress(developerAddress).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['holderAddress']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setHolderAddress(holderAddress).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['liquidityAddress']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setLiquidityAddress(liquidityAddress).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }

    if (changed['holdLimit']) {
      const loading = await appShowLoading(this.loadingCtrl);
      this.contractService.setHoldLimit(BigInt(holdLimit * 10)).subscribe(() => {
        loading.dismiss();
      }, error => {
        loading.dismiss();
        appCatchError(this.alertCtrl)(error);
      });
    }
  }
}