import { BadRequestException, PipeTransform } from '@nestjs/common';

const DEFAULT_LIMIT = 20;

export class SkipValidationPipe implements PipeTransform {
  transform(value: string) {
    const skip = parseInt(value, 10);

    if (isNaN(skip)) return 0;

    if (skip < 1) return 0;

    return skip;
  }
}

export class LimitValidationPipe implements PipeTransform {
  constructor(
    private readonly options: {
      maxLimit?: number; // undefined = no limit
    } = { maxLimit: 100 },
  ) {}

  transform(value: string) {
    const limit = parseInt(value, 10);

    if (isNaN(limit)) return DEFAULT_LIMIT;

    if (limit < 1) return 1;

    if (
      typeof this.options.maxLimit === 'number' &&
      limit > this.options.maxLimit
    ) {
      throw new BadRequestException(
        `Limit must not exceed ${this.options.maxLimit}`,
      );
    }

    return limit;
  }
}
