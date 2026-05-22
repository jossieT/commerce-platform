FROM node:20-alpine AS base
RUN npm i -g pnpm turbo

FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune @repo/api --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci

COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=@repo/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/package.json .
USER nestjs
EXPOSE 4000
CMD ["node", "dist/main"]
