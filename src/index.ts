import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';

import { resolvers } from '../prisma/generated/type-graphql';

const prisma = new PrismaClient();

// A `main` function so that you can use async/await
async function main() {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  });

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({ schema, context: () => ({ prisma }) });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
