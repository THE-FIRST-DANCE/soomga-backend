# build stage
FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/schema.prisma ./prisma/

RUN yarn install
RUN yarn prisma generate

COPY . .

RUN yarn build

# production stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

COPY package.json yarn.lock ./

RUN yarn install --production

EXPOSE 3000

CMD ["yarn", "start:prod"]
