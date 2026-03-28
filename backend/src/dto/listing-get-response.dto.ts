import { ApiProperty } from '@nestjs/swagger';
import { ListingItemDto } from './listing-get-all-response.dto';

class ListingSingleItemDto extends ListingItemDto {
  @ApiProperty({
    type: String,
    example: 'A beautiful house with 3 bedrooms and 2 bathrooms',
    description: 'Description of the property',
  })
  description: string;
}

export class ListingGetResponseDto {
  @ApiProperty({
    type: ListingSingleItemDto,
    description: 'The property listing',
  })
  data: ListingSingleItemDto;
}
