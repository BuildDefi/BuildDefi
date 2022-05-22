import { Injectable } from "@angular/core";
import * as Web3 from 'web3';

declare let require: any;
declare let window: any;

let tokenAbi = require('./BuildDefi.json');

@Injectable({ providedIn: 'root' })
export class ContractService {
  private mAccount: string = null;
  private mWeb3: any;

  private mToken: any;
  private mTokenAddress: string = "0xbc84f3bf7dd607a37f9e5848a6333e6c188d926c";

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.mWeb3 = new Web3(window.ethereum.currentProvider);
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    console.log(this.mWeb3);
    this.mToken = this.mWeb3.eth.contract(tokenAbi).at(this.mTokenAddress);
  }

  public async getUserBalance(): Promise<number> {
    let account = await this.getAccount();

    return new Promise((resolve, reject) => {
      let _web3 = this.mWeb3;
      this.mToken.balanceOf.call(account, function (err, result) {
        if(err != null) {
          reject(err);
        }

        resolve(_web3.fromWei(result));
      });
    }) as Promise<number>;
  }

  private async getAccount(): Promise<string> {
    if (this.mAccount == null) {
      this.mAccount = await new Promise((resolve, reject) => {
        this.mWeb3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        })
      }) as string;

      this.mWeb3.eth.defaultAccount = this.mAccount;
    }

    return Promise.resolve(this.mAccount);
  }
}