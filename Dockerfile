########
# builder stage
FROM node:18-alpine as builder
WORKDIR /usr/src/app

RUN apk add --no-cache g++ make py3-pip

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && \
  pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate && \
  pnpm build

########
# runner stage
FROM node:18-alpine as runner
WORKDIR /usr/src/app
RUN corepack enable

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

EXPOSE 3000

CMD ["pnpm", "start:prod"]
