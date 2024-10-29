# BASE stage
FROM node:latest AS base

WORKDIR /drizzle-studio

RUN npm init -y && \
    npm install drizzle-orm drizzle-kit typescript @types/node

COPY ./drizzle .

COPY ./src/models ./models

# Dev stage
FROM base AS development

RUN npm install pg

CMD npx drizzle-kit studio --port 4001


# Build stage
FROM base AS build

RUN npx tsc

# Prod stage
FROM node:latest AS production

WORKDIR /prod

COPY --from=build ./drizzle-studio/dist ./

RUN npm init -y && \
    npm install drizzle-orm pg drizzle-kit

CMD npx drizzle-kit studio --port 4001