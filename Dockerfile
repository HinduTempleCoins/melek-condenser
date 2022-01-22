FROM node:erbium-alpine3.14

LABEL maintainer jacob@blurt.foundation

RUN apk -U add git build-base python3 libtool libsodium autoconf automake gnupg gcc g++ make

COPY . /app

WORKDIR /app

RUN mkdir tmp && \
    yarn install && \
    yarn run build

ENV PORT 8080
ENV NODE_ENV production

CMD npm run production
