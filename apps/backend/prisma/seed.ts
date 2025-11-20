import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Music' },
      update: {},
      create: {
        name: 'Music',
        description: 'Concerts and music festivals',
        icon: 'music_note',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: {
        name: 'Sports',
        description: 'Sporting events and activities',
        icon: 'sports',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Technology' },
      update: {},
      create: {
        name: 'Technology',
        description: 'Tech conferences and meetups',
        icon: 'computer',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Arts & Culture' },
      update: {},
      create: {
        name: 'Arts & Culture',
        description: 'Art exhibitions and cultural events',
        icon: 'palette',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Business' },
      update: {},
      create: {
        name: 'Business',
        description: 'Business conferences and networking',
        icon: 'business',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create a sample organizer user
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@bookify.com' },
    update: {},
    create: {
      name: 'Event Organizer',
      email: 'organizer@bookify.com',
      password: '$2a$10$YourHashedPasswordHere', // bcrypt hash for "password123"
      role: 'organizer',
    },
  });

  console.log('Created organizer user');

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      title: 'Summer Music Festival 2025',
      description:
        'Join us for the biggest music festival of the year featuring top artists from around the world.',
      shortDescription:
        'The ultimate summer music experience with multiple stages and genres.',
      date: new Date('2025-07-15'),
      startTime: '14:00',
      endTime: '23:00',
      location: 'Central Park, New York',
      imageUrl: 'https://via.placeholder.com/800x400',
      agenda:
        'Gates open at 2 PM, Main acts start at 6 PM, Headliner at 9 PM',
      speakers: ['DJ Shadow', 'The Rockers', 'Jazz Ensemble'],
      totalSeats: 5000,
      availableSeats: 5000,
      status: 'published',
      organizerId: organizer.id,
      categoryId: categories[0].id,
      ticketTypes: {
        create: [
          {
            name: 'General Admission',
            price: 49.99,
            description: 'Standing area with full access',
            quantity: 3000,
            available: 3000,
          },
          {
            name: 'VIP',
            price: 149.99,
            description: 'Reserved seating with VIP lounge access',
            quantity: 500,
            available: 500,
          },
          {
            name: 'Premium',
            price: 299.99,
            description: 'Front row seats with meet & greet',
            quantity: 100,
            available: 100,
          },
        ],
      },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Tech Summit 2025',
      description:
        'Leading tech conference featuring talks from industry experts and hands-on workshops.',
      shortDescription: 'Learn about the latest in AI, Web3, and Cloud Computing',
      date: new Date('2025-06-20'),
      startTime: '09:00',
      endTime: '18:00',
      location: 'Convention Center, San Francisco',
      imageUrl: 'https://via.placeholder.com/800x400',
      agenda: 'Morning keynotes, afternoon workshops, evening networking',
      speakers: ['Jane Developer', 'John CTO', 'Sarah AI Researcher'],
      totalSeats: 1000,
      availableSeats: 1000,
      status: 'published',
      organizerId: organizer.id,
      categoryId: categories[2].id,
      ticketTypes: {
        create: [
          {
            name: 'Early Bird',
            price: 199.0,
            description: 'Limited early bird tickets',
            quantity: 200,
            available: 200,
          },
          {
            name: 'Standard',
            price: 299.0,
            description: 'Full conference access',
            quantity: 600,
            available: 600,
          },
          {
            name: 'Workshop Pass',
            price: 499.0,
            description: 'Conference + all workshops',
            quantity: 200,
            available: 200,
          },
        ],
      },
    },
  });

  console.log(`Created sample events: ${event1.title}, ${event2.title}`);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
