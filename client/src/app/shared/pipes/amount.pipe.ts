import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'amount' })
export class AmountPipe implements PipeTransform {
  transform(value: number, fixed = 4): string {
    const integers = Math.floor(value);
    let arr = [];

    `${integers}`.split('').reverse().forEach((r, i) => {
      if (i > 0 && i % 3 === 0) {
        arr.push(',');
      }
      arr.push(r);
    });
    const decimals = (value - integers).toFixed(fixed).replace('0.', '');

    return `${arr.reverse().join('')}${decimals ? `.${decimals}` : ''}`;
  }
}