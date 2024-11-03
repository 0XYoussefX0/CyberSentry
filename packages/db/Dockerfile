FROM node:latest

WORKDIR /drizzle-studio

COPY package*.json ./

RUN npm install

COPY . .

CMD npx drizzle-kit studio --port=4001 --config=drizzle.config.ts
