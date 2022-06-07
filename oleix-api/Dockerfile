FROM node:18-alpine as builder
RUN apk add --update openssl

ENV NODE_ENV build
USER node
WORKDIR /home/node

COPY ./package.json ./
COPY ./storage-credentials.json ./
COPY ./yarn.lock ./
COPY ./tsconfig* ./
COPY ./prisma ./prisma
COPY ./src ./src

RUN yarn --frozen-lockfile --ignore-scripts
RUN yarn prisma:generate
RUN yarn build

FROM node:18-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package.json ./
COPY --from=builder /home/node/yarn.lock ./
COPY --from=builder /home/node/prisma ./prisma
COPY --from=builder /home/node/dist ./dist
COPY --from=builder /home/node/storage-credentials.json ./

RUN yarn --production --frozen-lockfile

EXPOSE 80
CMD ["node", "dist/main.js"]