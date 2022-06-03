import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController, LoadingController } from "@ionic/angular";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { ContractService } from "../../services/contract.service";

@Component({
  selector: 'app-import-tokens',
  templateUrl: './import-tokens.page.html',
  styleUrls: ['./import-tokens.page.scss']
})
export class ImportTokensPage implements OnInit {
  form: FormGroup;

  constructor(
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
  }

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const { text } = this.form.value;
    const transfers: { address: string, amount: string }[] = text.split('\n').map((item: string) => {
      const cols = item.split('\t');
      return { address: cols[1].trim(), amount: cols[2].replace(/,/g, '') }
    }).filter((t: { address: string, amount: string}) => t.address.startsWith('0x'));

    const addresses = transfers.map(t => t.address);
    const amounts = transfers.map(t => t.amount);
    const loading = await appShowLoading(this.loadingCtrl);
    this.contractService.oneToManyTransfer(addresses, amounts).subscribe(async () => {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Importar Tokens',
        message: `Tokens importados com sucesso`,
        buttons: ['Ok']
      });
      alert.present();
      this.form.controls.text.patchValue(null);
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }
}