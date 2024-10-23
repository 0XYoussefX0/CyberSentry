# Stage 1: Base stage (common dependencies)
FROM node:latest AS base

WORKDIR /nodejs

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Development Stage
FROM base AS development

EXPOSE 4000

CMD ["npm", "run", "dev"]

# Stage 3: Production Build Stage
FROM base AS build

RUN npm run build

RUN npm prune --production

COPY package*.json ./prod/

COPY ./dist ./prod/dist/

# Stage 4: Production stage
FROM node:latest AS production

WORKDIR /nodejs

COPY --from=build /nodejs/prod ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]