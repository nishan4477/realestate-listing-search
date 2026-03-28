import { PrismaService } from '@lib/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, PropertyType } from 'libs/prisma/generated/browser';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async getListings({
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
  }: {
    skip: number;
    limit: number;
    searchTerm: string;
    sortBy: string;
    sortOrder: string;
    propertyType: PropertyType | undefined;
    beds: number | undefined;
    baths: number | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    isAdmin: boolean;
  }) {
    const where: Prisma.PropertyWhereInput = {};

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { suburb: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (beds) {
      where.beds = beds;
    }

    if (baths) {
      where.baths = baths;
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      };
    }

    const [data, total] = await this.prisma.$transaction(async (tx) =>
      Promise.all([
        tx.property.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          select: {
            id: true,
            title: true,
            price: true,
            beds: true,
            baths: true,
            suburb: true,
            internalNotes: isAdmin,
            propertyType: true,
            images: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        }),
        tx.property.count({ where }),
      ]),
    );

    return {
      data,
      meta: { total },
    };
  }

  async getListingById(id: string, isAdmin: boolean) {
    return this.prisma.property.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        beds: true,
        baths: true,
        suburb: true,
        internalNotes: isAdmin,
        propertyType: true,
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
  }
}
