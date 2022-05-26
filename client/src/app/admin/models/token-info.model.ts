export interface Fee {
  purchase: BigInt;
  sale: BigInt;
}

export interface TokenInfo {
  burnFeePurchase: BigInt;
  burnFeeSale: BigInt;
  developerFeePurchase: BigInt;
  developerFeeSale: BigInt;
  holderFeePurchase: BigInt;
  holderFeeSale: BigInt;
  liquidityFeePurchase: BigInt;
  liquidityFeeSale: BigInt;
  totalSupply: BigInt;
  decimals: BigInt;
  feeDenominator: BigInt;
  holdLimit: BigInt;
  developerAddress: string;
  holderAddress: string;
  liquidityAddress: string;
  owner: string;
}