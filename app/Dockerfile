FROM node:18-alpine as build

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

COPY ./*.json .
COPY ./src ./src/
RUN yarn build

FROM nginx

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/app/browser /usr/share/nginx/html/
