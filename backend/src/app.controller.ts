import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PropertyType } from 'libs/prisma/generated/enums';
import { AppService } from './app.service';
import { AppSwaggerDocs } from './app.swagger';
import {
  EnumValidationPipe,
  LimitValidationPipe,
  SkipValidationPipe,
  SortByValidationPipe,
  TrimSearchTermPipe,
} from './common/pipes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/listings')
  @AppSwaggerDocs.getListings()
  getListings(
    @Query('skip', SkipValidationPipe) skip: number,
    @Query('limit', LimitValidationPipe) limit: number,
    @Query('searchTerm', TrimSearchTermPipe) searchTerm: string,
    @Query(
      'sortBy',
      new SortByValidationPipe(
        ['createdAt', 'price', 'beds', 'baths'],
        'createdAt',
      ),
    )
    sortBy: string,
    @Query('sortOrder', new EnumValidationPipe(['asc', 'desc'], 'desc'))
    sortOrder: string,
    @Query('propertyType', new EnumValidationPipe(Object.values(PropertyType)))
    propertyType: PropertyType,
    @Query('beds', new ParseIntPipe({ optional: true })) beds: number,
    @Query('baths', new ParseIntPipe({ optional: true })) baths: number,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice: number,
    @Query('isAdmin', new ParseBoolPipe({ optional: true })) isAdmin: boolean,
  ) {
    return this.appService.getListings({
      skip,
      limit,
      searchTerm,
      sortBy,
      sortOrder,
      propertyType,
      beds,
      baths,
      minPrice,
      maxPrice,
      isAdmin,
    });
  }

  @Get('/listings/:id')
  @AppSwaggerDocs.getListingById()
  getListingById(
    @Param('id') id: string,
    @Query('isAdmin', new ParseBoolPipe({ optional: true })) isAdmin: boolean,
  ) {
    return this.appService.getListingById(id, isAdmin);
  }
}
