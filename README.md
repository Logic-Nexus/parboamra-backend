## to open prisma studio -

- npx prisma studio

## to install prisma client -

- npm install @prisma/client

## to generate prisma client -

- npx prisma generate

////////////////////////////////////

## for prisma -

## setup database -

- npx prisma init --datasource-provider postgresql

create migration -
npx prisma migrate dev --name init

## run migration -

npx prisma migrate deploy

## push to database -

- npx prisma db push ///to sync schema with database and create tables in database

## run seed

- npx prisma db seed --preview-feature

- npm i --save esbuild

## express validator -

- npm i express-validator

Create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)
$ npx prisma migrate dev

Reset your database and apply all migrations
$ prisma migrate reset

Apply pending migrations to the database in production/staging
$ prisma migrate deploy

Check the status of migrations in the production/staging database
$ prisma migrate status

Specify a schema
$ prisma migrate status --schema=./schema.prisma

## revert migration -

---

npx prisma migrate reset ///to revert migration and delete tables from database and sync schema with database and create tables in database again with new changes in schema file
