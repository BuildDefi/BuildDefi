import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { Contract, providers } from 'ethers';
import { environment } from "src/environments/environment";
import { TokenInfo } from "../models/token-info.model";

declare let require: any;
declare let window: any;

let tokenAbi = require('./BuildDefi.json');

@Injectable({ providedIn: 'root' })
export class ContractService {

  private mContract = new BehaviorSubject<Contract>(null);
  private mSignerAddress = new BehaviorSubject<string>(null);
  private mTokenInfo = new BehaviorSubject<TokenInfo>(null);

  get signerAddress(): Observable<string> {
    return this.mSignerAddress.asObservable();
  }

  get tokenInfo(): Observable<TokenInfo> {
    return this.mTokenInfo.asObservable();
  }

  get takeTokenInfo() {
    return this.tokenInfo.pipe(
      take(1)
    );
  }

  private get contract() {
    return this.mContract.asObservable().pipe(
      take(1),
      tap(contract => {
        if (!contract) {
          throw new Error('UndefinedContract');
        }
      })
    );
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

        this.mContract.next(new Contract(environment.contract.address, tokenAbi, signer))

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
    this.mContract.next(null);
    return of({});
  }

  fetchInfo(): Observable<void> {
    return this.getProperties([
      'getDeveloperFee:fe', 'getHolderFee:fe',
      'getLiquidityFee:fe', 'getOtherFee:fe', 'totalSupply:bn', 'decimals:bn',
      'getFeeDenominator:bn', 'getDeveloperAddress',
      'getHolderAddress', 'getLiquidityAddress', 'getOtherAddress',
      'owner', 'getHoldLimit:bn'
    ]).pipe(
      map(res => {
        this.mTokenInfo.next({
          developerFeePurchase: res[0].purchase,
          developerFeeSale: res[0].sale,
          holderFeePurchase: res[1].purchase,
          holderFeeSale: res[1].sale,
          liquidityFeePurchase: res[2].purchase,
          liquidityFeeSale: res[2].sale,
          otherFeePurchase: res[3].purchase,
          otherFeeSale: res[3].sale,
          totalSupply: res[4] / (BigInt(10) ** res[5]),
          decimals: res[5],
          feeDenominator: res[6],
          developerAddress: res[7],
          holderAddress: res[8],
          liquidityAddress: res[9],
          otherAddress: res[10],
          owner: res[11],
          holdLimit: res[12]
        });
      })
    );
  }

  balanceOf(address: string): Observable<number> {
    let cDecimals: any;
    let cContract: any;

    return this.contract.pipe(
      switchMap(contract => {
        cContract = contract;

        return from(cContract.decimals());
      }),
      switchMap(decimals => {
        cDecimals = decimals;
        return from(cContract.balanceOf(address));
      }),
      map(res => {
        return Number(res) / (10 * 10 ** cDecimals);
      })
    );
  }

  setFeeDenominator(feeDenominator: BigInt): Observable<void> {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setFeeDenominator(feeDenominator));
      })
    );
  }

  setDeveloperFee(purchase: BigInt, sale: BigInt): Observable<void> {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setDeveloperFee(purchase, sale));
      })
    );
  }

  setHolderFee(purchase: BigInt, sale: BigInt): Observable<void> {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setHolderFee(purchase, sale));
      })
    );
  }

  setLiquidityFee(purchase: BigInt, sale: BigInt): Observable<void> {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setLiquidityFee(purchase, sale));
      })
    );
  }

  setOtherFee(purchase: BigInt, sale: BigInt): Observable<void> {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setOtherFee(purchase, sale));
      })
    );
  }

  setDeveloperAddress(address: string) {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setDeveloperAddress(address));
      })
    );
  }

  setHolderAddress(address: string) {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setHolderAddress(address));
      })
    );
  }

  setLiquidityAddress(address: string) {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setLiquidityAddress(address));
      })
    );
  }

  setOtherAddress(address: string) {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setOtherAddress(address));
      })
    );
  }

  setHoldLimit(holdLimit: BigInt): Observable<void> {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setHoldLimit(holdLimit));
      })
    );
  }

  isPair(address: string): Observable<any> {
    return this.contract.pipe(
      switchMap(contract => {
        return from(contract.isPair(address));
      })
    );
  }

  setIsPair(address: string, value: boolean) {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setIsPair(address, value));
      })
    );
  }

  isExcludedFromFee(address: string): Observable<any> {
    return this.contract.pipe(
      switchMap(contract => {
        return from(contract.isExcludedFromFee(address));
      })
    );
  }

  setIsExcludedFromFee(address: string, value: boolean) {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.setIsExcludedFromFee(address, value));
      })
    );
  }

  burn(value: string) {
    return this.contract.pipe(
      switchMap(contract => {
        return this.transact(contract.burn(value));
      })
    );
  }

  oneToManyTransfer(addresses: string[], amounts: string[]) {
    let cContract: any;
    return this.contract.pipe(
      switchMap(contract => {
        cContract = contract;

        return this.takeTokenInfo;
      }),
      switchMap(tokenInfo => {
        if (tokenInfo) {
          return of({});
        }

        return this.fetchInfo();
      }),
      switchMap(() => {
        return this.takeTokenInfo;
      }),
      switchMap(tokenInfo => {
        const decimals = +tokenInfo.decimals.toString();
        const amountsToTransfer = amounts.map(a => {
          return BigInt(Math.floor(+a * (10 ** decimals)));
        });

        return this.transact(cContract.oneToManyTransfer(addresses, amountsToTransfer));
      })
    );
  }

  private getProperties(props: string[]): Observable<any[]> {
    let cContract: Contract;

    let obs: Observable<any> = this.contract.pipe(
      tap(contract => {
        cContract = contract;
      })
    );

    let results = [];

    props.forEach(prop => {
      const tokens = prop.split(':');

      obs = obs.pipe(
        switchMap(() => {
          return from(cContract[tokens[0]]());
        }),
        map((res: any) => {
          switch (tokens[1]) {
            case 'fe':
              results.push({
                purchase: Number(res.purchase),
                sale: Number(res.sale)
              });
              break;
            case 'bn':
              results.push(BigInt(res));
              break;
            default:
              results.push(res);
          }
        })
      );
    });

    return obs.pipe(
      map(() => {
        return results;
      })
    );
  }

  private transact(promise: Promise<any>) {
    return from(promise).pipe(
      switchMap(tx => {
        return from(tx.wait());
      }),
      map(() => {})
    );
  }
}