import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {

  transform(value: string) {
    return `${value.substring(0, 6)}...${value.substring(38)}`;
  }
}