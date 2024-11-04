FROM node:latest AS base

WORKDIR /pentest-app

RUN npm i -g turbo@^2

COPY . .

RUN turbo prune backend --docker


FROM base AS installer

WORKDIR /pentest-app

COPY --from=base /pentest-app/out/json/ .

RUN npm install

COPY --from=base /pentest-app/out/full/ .

RUN npx turbo run build --filter=backend...

RUN npm prune --production

FROM base AS runner

WORKDIR /pentest-app

RUN addgroup --system --gid 1001 backend
RUN adduser --system --uid 1001 backenduser
USER backenduser

COPY --from=installer /pentest-app .

CMD node pentest-app/backend/dist/server.js