import faker from '@faker-js/faker';
import { Prisma, User } from '@prisma/client';

const ADVERTS_COUNT = 100;
const USERS_COUNT = 20;

export const getSeedAdverts = (users: User[]): Prisma.Enumerable<Prisma.AdvertCreateManyInput> =>
  Array.from(Array(ADVERTS_COUNT).keys()).map(() => ({
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    description: faker.commerce.productDescription(),
    localization: faker.address.city(),
    phone: faker.phone.phoneNumber('+## ### ### ###'),
    authorId: users[0].userId,
  }));

export const getSeedUsers = (): Prisma.Enumerable<Prisma.UserCreateManyInput> =>
  Array.from(Array(USERS_COUNT).keys()).map(() => ({
    username: faker.internet.userName(),
    localization: faker.address.city(),
    phone: faker.phone.phoneNumber('+## ### ### ###'),
    passwordHash: faker.internet.password(),
    email: faker.internet.email(),
  }));
