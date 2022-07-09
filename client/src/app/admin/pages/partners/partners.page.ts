import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { appCatchError, appShowLoading } from "src/app/app.functions";
import { Partner } from "src/app/models/partner.model";
import { PartnerService } from "src/app/services/partner.service";

@Component({
  selector: 'app-admin-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss']
})
export class PartnersPage implements OnInit, OnDestroy {
  partners: Partner[];
  subs: Subscription[] = [];

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private partnerService: PartnerService
  ) { }

  async ngOnInit() {
    this.subs.push(
      this.partnerService.partners.subscribe(partners => {
        this.partners = partners;
      })
    );

    const loading = await appShowLoading(this.loadingCtrl);
    this.partnerService.fetchAll().subscribe(() => {
      loading.dismiss();
    }, error => {
      loading.dismiss();
      appCatchError(this.alertCtrl)(error);
    });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}