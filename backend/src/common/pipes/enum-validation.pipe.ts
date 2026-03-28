import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EnumValidationPipe implements PipeTransform {
  private readonly allowedFields: string[];
  private readonly defaultField?: string;

  constructor(allowedFields: string[], defaultField?: string) {
    this.allowedFields = allowedFields;
    this.defaultField = defaultField;
  }

  transform(value: any): string | undefined {
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
