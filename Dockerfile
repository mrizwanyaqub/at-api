# Dockerfile
FROM node:9-alpine

WORKDIR '/var/www/app'

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install --only=production \
    && apk del .gyp

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]