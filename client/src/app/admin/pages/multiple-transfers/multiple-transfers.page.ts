import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { ContractService } from "../../../services/contract.service";

interface AddressValue {
  address: string;
  value: string;
};

@Component({
  selector: 'app-multiple-transfers',
  templateUrl: './multiple-transfers.page.html',
  styleUrls: ['./multiple-transfers.page.scss']
})
export class MultipleTransfersPage implements OnInit {
  form: FormGroup;
  convertForm: FormGroup;

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private contractService: ContractService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      text: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });

    this.convertForm = new FormGroup({
      quantity: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      text: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const { text } = this.form.value;
    const transfers = this.parseText(text);

    const addresses = transfers.map(t => t.address);
    const amounts = transfers.map(t => t.value);
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.oneToManyTransfer(addresses, amounts).subscribe(async () => {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Multiplas Transferências',
        message: `Tokens transferido com sucesso`,
        buttons: ['Ok']
      });
      alert.present();
      this.form.controls.text.patchValue(null);
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }

  async convertSubmit() {
    if (this.convertForm.invalid) {
      return;
    }

    const { quantity, text } = this.convertForm.value;
    const addressValues = this.parseText(text);
    let total = 0;

    addressValues.forEach(ad => {
      total += +ad.value;
    });

    const valuePerQuote = quantity / total;

    this.form.controls.text.patchValue(
      addressValues.map(av => {
        return `${av.address} ${+av.value * valuePerQuote}`;
      }).join('\n')
    );
    const toast = await this.toastCtrl.create({
      message: 'Conversão executada com sucesso, olhe o card Transferir Tokens!',
      duration: 1000
    });
    toast.present();
  }

  private parseText(text: string): AddressValue[] {
    return text.split('\n').map((item: string) => {
      if (!item) {
        return null;
      }

      const cols = item.replace(/\t/g, ' ').split(' ');
      return { address: cols[0].trim(), value: cols[1].replace(/,/g, '') } as AddressValue;
    }).filter(av => av && av.address.startsWith('0x') && av.address.length === 42);
  }
}