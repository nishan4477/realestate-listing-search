import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from 'libs/prisma/generated/browser';

// ── Image ─────────────────────────────────────────────────────────────────────

export class PropertyImageDto {
  @ApiProperty({ example: 'clx1234abcd' })
  id: string;

  @ApiProperty({ example: 'https://picsum.photos/seed/maharajgunj1/800/600' })
  url: string;
}

export class ListingItemDto {
  @ApiProperty({ example: 'clx1234abcd' })
  id: string;

  @ApiProperty({ example: 'Luxury Villa in Maharajgunj' })
  title: string;

  @ApiProperty({ example: 45000000 })
  price: number;

  @ApiProperty({ example: 5 })
  beds: number;

  @ApiProperty({ example: 4 })
  baths: number;

  @ApiProperty({ example: 'Maharajgunj' })
  suburb: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.house })
  propertyType: PropertyType;

  @ApiProperty({ type: [PropertyImageDto] })
  images: PropertyImageDto[];

  @ApiPropertyOptional({ example: 'Internal notes' })
  internalNotes?: string;
}

export class ListingMetaDto {
  @ApiProperty({ example: 42 })
  total: number;
}

export class ListingsResponseDto {
  @ApiProperty({ type: [ListingItemDto] })
  data: ListingItemDto[];

  @ApiProperty({ type: ListingMetaDto })
  meta: ListingMetaDto;
}
