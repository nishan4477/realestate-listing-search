import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SortByValidationPipe implements PipeTransform {
  private readonly allowedFields: string[];
  private readonly defaultField: string = 'createdAt';

  constructor(allowedFields: string[], defaultField: string = 'createdAt') {
    this.allowedFields = allowedFields;
    this.defaultField = defaultField;
  }

  transform(value: any): string {
    // Normalize the value (to lowercase) if it's a string
    const normalizedValue = typeof value === 'string' ? value : '';

    // Check if the normalized value is one of the allowed fields
    if (this.allowedFields.includes(normalizedValue)) {
      return normalizedValue;
    }

    // Default to the specified defaultField if the value is invalid or undefined
    return this.defaultField;
  }
}

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortOrder = `${SortDirection}`;

const isSortDirection = (value: unknown): value is SortDirection =>
  value === SortDirection.ASC || value === SortDirection.DESC;

export class SortOrderValidationPipe implements PipeTransform {
  private readonly defaultOrder: SortOrder;

  constructor(defaultOrder: SortOrder = SortDirection.DESC) {
    this.defaultOrder = defaultOrder;
  }

  transform(value: unknown): SortOrder {
    const normalizedValue =
      typeof value === 'string' ? value.toLowerCase() : value;

    if (isSortDirection(normalizedValue)) {
      return normalizedValue;
    }

    return this.defaultOrder;
  }
}
