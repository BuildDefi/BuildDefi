import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { Contract, providers } from 'ethers';
import { environment } from "src/environments/environment";

declare let require: any;
declare let window: any;

let tokenAbi = require('./BuildDefi.json');

@Injectable({ providedIn: 'root' })
export class ContractService {

  private contract: Contract;

  private mSignerAddress = new BehaviorSubject<string>(null);

  get signerAddress(): Observable<string> {
    return this.mSignerAddress.asObservable();
  }

  constructor() {}

  connectToWallet(): Observable<any> {
    const provider = new providers.Web3Provider(window.ethereum, 'any');
    let signer: providers.JsonRpcSigner;

    return from(provider.send("eth_requestAccounts", [])).pipe(
      switchMap(() => {
        signer = provider.getSigner();
        return from(signer.getChainId());
      }),
      switchMap(chainId => {
        if (environment.chain.id !== chainId) {
          throw new Error("WrongChainId");
        }

        this.contract = new Contract(environment.contract.address, tokenAbi, signer);
        console.log(this.contract.functions);

        return from(signer.getAddress());
      }),
      map(signerAddress => {
        this.mSignerAddress.next(signerAddress);
        return window.ethereum;
      })
    );
  }

  clearConnection(): Observable<any> {
    this.mSignerAddress.next(null);
    this.contract = null;
    return of({});
  }
}