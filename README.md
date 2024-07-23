## Description

NestJS microservices application allowing to place reservations, send email notifications, make stripe payments and manage user accounts. Project is based on sleepr from [NestJS Microservices: Build & Deploy a Scaleable Backend course made by Michael Guay](https://www.udemy.com/course/nestjs-microservices-build-deploy-a-scaleable-backend/?couponCode=MCLARENT71824).

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# docker run
$ docker-compose up

# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
