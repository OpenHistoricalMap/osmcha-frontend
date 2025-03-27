FROM node:22-alpine as builder

ENV DEBIAN_FRONTEND noninteractive

ARG BUILD_ENV=prod

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn set version stable
RUN yarn install
RUN sed -i "s|mapbox://styles/[^\"']*|https://gist.githubusercontent.com/Rub21/27be2d3482f66743393af068ff68985d/raw/3cee0905224fc8dcac5a34937fad036c9f6fbbf9/historical.json|g" node_modules/changeset-map/dist/*.js

COPY src/ /app/src
COPY public/ /app/public
ENV REACT_APP_PRODUCTION_API_URL /api/v1

# fix for openssl ERR_OSSL_EVP_UNSUPPORTED
# 'error:03000086:digital envelope routines::initialization error'
ENV NODE_OPTIONS --openssl-legacy-provider

RUN yarn run build:${BUILD_ENV}

FROM nginx:alpine
COPY --from=builder /app/build /srv/www
COPY nginx.conf /etc/nginx/templates/default.conf.template
