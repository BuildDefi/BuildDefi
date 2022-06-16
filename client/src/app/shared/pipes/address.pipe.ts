import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'address' })
export class AddressPipe implements PipeTransform {

  transform(value: string, offset = 4) {
    if (!value) {
      return '';
    }

    return `${value.substring(0, 2 + offset)}...${value.substring(42 - offset)}`;
  }
}