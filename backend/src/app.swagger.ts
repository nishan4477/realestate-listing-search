import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { PropertyType } from 'libs/prisma/generated/enums';
import { ListingsResponseDto } from './dto';
import { ListingGetResponseDto } from './dto/listing-get-response.dto';

export const AppSwaggerDocs = {
  getListings: () =>
    applyDecorators(
      ApiOperation({
        summary: 'List properties',
        description:
          'Returns paginated property listings with optional filters for search term, price range, property type, beds, and baths.',
      }),
      ApiQuery({
        name: 'skip',
        required: false,
        type: Number,
        example: 0,
        description: 'Number of records to skip for pagination',
      }),
      ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of records to return',
      }),
      ApiQuery({
        name: 'searchTerm',
        required: false,
        type: String,
        example: 'villa',
        description: 'Search across title, description, and suburb',
      }),
      ApiQuery({
        name: 'sortBy',
        required: false,
        type: String,
        example: 'createdAt',
        enum: ['createdAt', 'price', 'beds', 'baths'],
        description: 'Field to sort results by',
      }),
      ApiQuery({
        name: 'sortOrder',
        required: false,
        type: String,
        example: 'desc',
        enum: ['asc', 'desc'],
        description: 'Sort direction',
      }),
      ApiQuery({
        name: 'propertyType',
        required: false,
        enum: PropertyType,
        example: PropertyType.house,
        description: 'Filter by property type',
      }),
      ApiQuery({
        name: 'beds',
        required: false,
        type: Number,
        example: 3,
        description: 'Filter by exact number of bedrooms',
      }),
      ApiQuery({
        name: 'baths',
        required: false,
        type: Number,
        example: 2,
        description: 'Filter by exact number of bathrooms',
      }),
      ApiQuery({
        name: 'minPrice',
        required: false,
        type: Number,
        example: 5000000,
        description: 'Minimum price in NPR',
      }),
      ApiQuery({
        name: 'maxPrice',
        required: false,
        type: Number,
        example: 50000000,
        description: 'Maximum price in NPR',
      }),
      ApiQuery({
        name: 'isAdmin',
        required: false,
        type: Boolean,
        example: false,
        description: 'Filter by admin status',
      }),
      ApiExtraModels(ListingsResponseDto),
      ApiOkResponse({ type: ListingsResponseDto }),
    ),

  getListingById: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get property by ID',
        description: 'Returns a single property listing by its ID.',
      }),
      ApiQuery({
        name: 'isAdmin',
        required: false,
        type: Boolean,
        example: false,
        description: 'Filter by admin status',
      }),
      ApiExtraModels(ListingGetResponseDto),
      ApiOkResponse({ type: ListingGetResponseDto }),
    ),
};
