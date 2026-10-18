# Stage: builder

FROM node:20-bookworm-slim AS builder
WORKDIR /condenser

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Stage: runtime

FROM node:20-bookworm-slim AS runtime
LABEL org.opencontainers.image.source="https://github.com/HinduTempleCoins/melek-condenser"

WORKDIR /condenser
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder --chown=node:node /condenser/package.json ./
COPY --from=builder --chown=node:node /condenser/node_modules ./node_modules
COPY --from=builder --chown=node:node /condenser/lib ./lib
COPY --from=builder --chown=node:node /condenser/dist ./dist
COPY --from=builder --chown=node:node /condenser/config ./config
COPY --from=builder --chown=node:node /condenser/tmp ./tmp
COPY --from=builder --chown=node:node /condenser/webpack ./webpack
COPY --from=builder --chown=node:node /condenser/portal ./portal
COPY --from=builder --chown=node:node /condenser/src/ ./src/

USER node
EXPOSE 8080
CMD ["npm", "run", "production"]