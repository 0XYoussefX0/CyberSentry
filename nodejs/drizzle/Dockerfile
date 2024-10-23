# BASE stage
FROM node:latest as base

WORKDIR /drizzle-studio

RUN npm init -y && \
    npm install drizzle-orm drizzle-kit typescript @types/node

COPY ./drizzle .

COPY ./src/models ./models

# Dev stage
FROM base as development

RUN npm install pg

RUN chmod +x ./start.sh

CMD ["./start.sh"]


# Build stage
FROM base as build

RUN npx tsc 

COPY ./drizzle/start.sh ./dist/

# Prod stage
FROM node:latest as production

WORKDIR /prod

COPY --from=build ./drizzle-studio/dist ./

RUN npm init -y && \
    npm install drizzle-orm pg drizzle-kit

RUN chmod +x ./start.sh

CMD ["./start.sh"]