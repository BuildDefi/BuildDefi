import { Component } from "@angular/core";
import { ContractService } from "../../services/contract.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage {

  constructor(
    private contractService: ContractService
  ) { }
}