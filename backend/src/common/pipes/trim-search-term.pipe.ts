import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimSearchTermPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return value.trim();
    } else return '';
  }
}
