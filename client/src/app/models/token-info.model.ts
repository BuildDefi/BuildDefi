export interface Fee {
  purchase: BigInt;
  sale: BigInt;
}

export interface TokenInfo {
  developerFeePurchase: BigInt;
  developerFeeSale: BigInt;
  holderFeePurchase: BigInt;
  holderFeeSale: BigInt;
  liquidityFeePurchase: BigInt;
  liquidityFeeSale: BigInt;
  otherFeePurchase: BigInt;
  otherFeeSale: BigInt;
  totalSupply: BigInt;
  decimals: BigInt;
  feeDenominator: BigInt;
  holdLimit: BigInt;
  developerAddress: string;
  holderAddress: string;
  liquidityAddress: string;
  otherAddress: string;
  owner: string;
}