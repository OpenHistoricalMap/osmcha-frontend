FROM node:22-alpine as builder

ENV DEBIAN_FRONTEND noninteractive

ENV REACT_APP_PAGE_SIZE: "25"
ENV REACT_APP_OVERPASS_BASE: "//overpass-api.openhistoricalmap.org/api/interpreter"
ENV REACT_APP_MAPBOX_ACCESS_TOKEN: "pk.eyJ1Ijoib3Blbmhpc3RvcmljYWxtYXAiLCJhIjoiY202a3ZqcHN1MDJnYzJpcHhlczVqbXBuNiJ9.DvNrZEF1ISEluA9k-MSHtA"
ENV REACT_APP_OSM_URL: "https://www.openhistoricalmap.org"
ENV REACT_APP_OSM_API: "https://api.openhistoricalmap.org/api/0.6"
ENV REACT_APP_NOMINATIM_URL: "https://nominatim-api.openhistoricalmap.org/search.php"
ENV REACT_APP_DEFAULT_FROM_DATE: "2"
ENV REACT_APP_DEFAULT_TO_DATE: "5"
ENV REACT_APP_DISABLE_REAL_CHANGESETS: "false"

ARG BUILD_ENV=prod

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn set version stable
RUN yarn install

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
