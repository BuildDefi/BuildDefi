import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AlertController, LoadingController, ModalController } from "@ionic/angular";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { Partner } from "src/app/models/partner.model";
import { PartnerService } from "src/app/services/partner.service";

@Component({
  selector: 'app-become-modal',
  templateUrl: './become.modal.html',
  styleUrls: ['./become.modal.scss']
})
export class BecomeModal implements OnInit {

  form: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private partnerService: PartnerService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      registeredName: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tradingName: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      taxPayerRegistration: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      phoneNumber: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.email]
      }),
      productService: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      comments: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async submit() {
    if (this.form.invalid) {
      return;
    }

    const {
      registeredName, tradingName, taxPayerRegistration,
      phoneNumber, email, productService, comments
    } = this.form.value;

    const loading = await appShowLoading(this.loadingCtrl);
    this.partnerService.save(
      new Partner({
        registeredName, tradingName, taxPayerRegistration,
        phoneNumber, email, productService, comments
      })
    ).subscribe(async () => {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Sucesso',
        message: 'Dados enviados com sucesso, entraremos em contato em breve!',
        buttons: ['Ok']
      });
      alert.present();
      this.modalCtrl.dismiss();
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    })
  }
}