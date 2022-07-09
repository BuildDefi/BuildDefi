export class Partner {
  id: number;
  registeredName: string;
  tradingName: string;
  taxPayerRegistration: string;
  phoneNumber: string;
  email: string;
  productService: string;
  comments: string;

  constructor(res: any) {
    this.id = res.id;
    this.registeredName = res.registeredName;
    this.tradingName = res.tradingName;
    this.taxPayerRegistration = res.taxPayerRegistration;
    this.phoneNumber = res.phoneNumber;
    this.email = res.email;
    this.productService = res.productService;
    this.comments = res.comments;
  }
}