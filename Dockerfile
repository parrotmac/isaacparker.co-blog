FROM node:9 as client-builder

WORKDIR /usr/src/app

ADD client/package.json /usr/src/app/
ADD client/package-lock.json /usr/src/app/

RUN npm install

ADD client/ /usr/src/app
RUN npm run build
