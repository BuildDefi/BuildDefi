import { Component } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {

  openCoinGecko() {
    window.open('https://', '_blank');
  }

  openCoinMarketCap() {
    window.open('https://', '_blank');
  }

  openPooCoin() {
    window.open(`https://poocoin.app/tokens/${environment.contract.address}`, '_blank');
  }

  openBscScan() {
    window.open(`https://bscscan.com/token/${environment.contract.address}`, '_blank');
  }

  openPancakeSwap() {
    window.open(`https://pancakeswap.finance/swap?outputCurrency=${environment.contract.address}`, '_blank');
  }
}