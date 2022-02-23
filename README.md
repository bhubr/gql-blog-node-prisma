# Prisma starter

Project generated from [Prisma quickstart](https://www.prisma.io/docs/getting-started/quickstart)

On initialization:

* Schema already exists
* DB provider is `sqlite`

## Steps to configure manually (MySQL)

* [Setup for rel DBs](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-mysql)

    * Create project dir,
    * `npm init -y`,
    * `npm i -D prisma typescript ts-node @types/node`,
    * Setup `tsconfig.json`,
    * `npx prisma init` (generate `prisma/schema.prisma` and `.env`)
* [Connect your database](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-mysql)

    * Change provider type to `mysql` in `schema.prisma`,
    * Adapt `DATABASE_URL` in `.env`,
    * Create MySQL db (and user)
* [Prisma Migrate](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-mysql)

    * `npx prisma migrate dev --name init`
    * See [using multiple `.env` files](https://www.prisma.io/docs/guides/development-environment/environment-variables/using-multiple-env-files) for test db setup
    * `npm i @prisma/client`