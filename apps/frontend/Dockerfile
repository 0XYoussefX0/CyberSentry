FROM node:latest AS base

WORKDIR /pentest-app

RUN npm i -g turbo@^2

COPY . .

RUN turbo prune frontend --docker


FROM base AS installer

WORKDIR /pentest-app

COPY --from=base /pentest-app/out/json/ .

RUN npm install

COPY --from=base /pentest-app/out/full/ .

RUN npx turbo run build --filter=frontend...


FROM base AS runner

WORKDIR /pentest-app

RUN addgroup --system --gid 1001 frontend
RUN adduser --system --uid 1001 frontenduser
USER frontenduser

COPY --from=installer --chown=frontenduser:frontend /pentest-app/apps/frontend/.next/standalone ./
COPY --from=installer --chown=frontenduser:frontend /pentest-app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=installer --chown=frontenduser:frontend /pentest-app/apps/frontend/public ./apps/frontend/public

CMD node apps/frontend/server.js