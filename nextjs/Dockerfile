# Stage 1: Base stage (common dependencies)
FROM node:latest AS base

WORKDIR /nextjs

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Development Stage
FROM base AS development

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 3: Production Build Stage
FROM base AS build

RUN npm run build

# Stage 4: Production stage
FROM node:latest AS production

WORKDIR /nextjs

ENV NODE_ENV=production
COPY --from=build /nextjs/public ./public
COPY --from=build /nextjs/.next/standalone ./
COPY --from=build /nextjs/.next/static ./.next/static


EXPOSE 3000

CMD ["npm", "run", "start"]