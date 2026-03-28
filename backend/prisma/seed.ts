import { PrismaPg } from '@prisma/adapter-pg';

import * as dotenv from 'dotenv';
import pg from 'pg';
import {
  ListingStatus,
  PrismaClient,
  PropertyType,
} from '../libs/prisma/generated/client.js';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── Agents ────────────────────────────────────────────────────────────────
  const agent1 = await prisma.agent.upsert({
    where: { email: 'rajesh.sharma@realty.com.np' },
    update: {},
    create: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@realty.com.np',
      phone: '+977-9801234567',
    },
  });

  const agent2 = await prisma.agent.upsert({
    where: { email: 'priya.thapa@realty.com.np' },
    update: {},
    create: {
      name: 'Priya Thapa',
      email: 'priya.thapa@realty.com.np',
      phone: '+977-9851234567',
    },
  });

  // ── Properties ────────────────────────────────────────────────────────────
  const properties = [
    {
      title: 'Luxury Villa in Maharajgunj',
      description:
        'A stunning 5-bedroom luxury villa nestled in the heart of Maharajgunj. Features an open-plan living area, modern kitchen, private garden, and rooftop terrace with panoramic views of the Kathmandu Valley. Walking distance to international schools and embassies.',
      price: 45000000,
      beds: 5,
      baths: 4,
      propertyType: PropertyType.house,
      suburb: 'Maharajgunj',
      status: ListingStatus.active,
      internalNotes:
        'Owner relocating to Australia. Open to negotiation above 4.2 Crore.',
      agentId: agent1.id,
      images: [
        `https://picsum.photos/seed/maharajgunj1/800/600`,
        `https://picsum.photos/seed/maharajgunj2/800/600`,
        `https://picsum.photos/seed/maharajgunj3/800/600`,
      ],
    },
    {
      title: 'Modern Apartment in Jhamsikhel',
      description:
        'A sleek 3-bedroom apartment on the 4th floor of a newly built complex in Jhamsikhel. Features premium finishes, fully fitted kitchen, two covered parking spots, and 24/7 security. Close to restaurants, cafes, and the bustling Patan area.',
      price: 18500000,
      beds: 3,
      baths: 2,
      propertyType: PropertyType.apartment,
      suburb: 'Jhamsikhel',
      status: ListingStatus.active,
      internalNotes:
        'Tenant currently in place until Poush 2082. Vacant possession available after.',
      agentId: agent2.id,
      images: [
        `https://picsum.photos/seed/jhamsikhel1/800/600`,
        `https://picsum.photos/seed/jhamsikhel2/800/600`,
      ],
    },
    {
      title: 'Spacious Townhouse in Bhaisepati',
      description:
        'A well-maintained 4-bedroom townhouse in the quiet residential enclave of Bhaisepati. Spread over three floors with a private rooftop, sunlit living areas, and a small garden. Ideal for families looking for a peaceful lifestyle just 20 minutes from Patan Dhoka.',
      price: 27500000,
      beds: 4,
      baths: 3,
      propertyType: PropertyType.townhouse,
      suburb: 'Bhaisepati',
      status: ListingStatus.active,
      internalNotes:
        'Motivated seller — purchased land in Pokhara. Will consider 2.55 Crore cash offer.',
      agentId: agent1.id,
      images: [
        `https://picsum.photos/seed/bhaisepati1/800/600`,
        `https://picsum.photos/seed/bhaisepati2/800/600`,
        `https://picsum.photos/seed/bhaisepati3/800/600`,
      ],
    },
    {
      title: 'Prime Land in Budhanilkantha',
      description:
        'A rare 8 aana prime land parcel in the rapidly developing Budhanilkantha area. Road-facing, rectangular plot with clear title and all utility connections available at the boundary. Excellent for building a family home or investment development.',
      price: 32000000,
      beds: 0,
      baths: 0,
      propertyType: PropertyType.land,
      suburb: 'Budhanilkantha',
      status: ListingStatus.active,
      internalNotes:
        'Title verified by our legal team. Owner has two other plots — may bundle for right offer.',
      agentId: agent2.id,
      images: [
        `https://picsum.photos/seed/budhanilkantha1/800/600`,
        `https://picsum.photos/seed/budhanilkantha2/800/600`,
      ],
    },
    {
      title: 'Commercial Space in New Baneshwor',
      description:
        'A high-visibility ground-floor commercial unit in the bustling New Baneshwor corridor. 2,400 sq ft of open-plan space with three dedicated parking slots, full glass frontage, and independent electricity and water meters. Ideal for a bank, showroom, or office.',
      price: 62000000,
      beds: 0,
      baths: 2,
      propertyType: PropertyType.commercial,
      suburb: 'New Baneshwor',
      status: ListingStatus.active,
      internalNotes:
        'Previous tenant was a major bank — well maintained. Owner prefers long-term lease buyer.',
      agentId: agent1.id,
      images: [
        `https://picsum.photos/seed/baneshwor1/800/600`,
        `https://picsum.photos/seed/baneshwor2/800/600`,
        `https://picsum.photos/seed/baneshwor3/800/600`,
      ],
    },
  ];

  for (const property of properties) {
    const { images, ...propertyData } = property;

    const created = await prisma.property.create({
      data: {
        ...propertyData,
        images: {
          create: images.map((url, index) => ({
            url,
            alt: `${propertyData.title} — image ${index + 1}`,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
      },
    });

    console.log(
      `Seeded: ${created.title} — NPR ${Number(created.price).toLocaleString('en-NP')}`,
    );
  }

  console.log('\n Seeding complete. 2 agents, 5 properties created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
