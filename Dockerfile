FROM node:8-alpine as client-builder

RUN apk update && apk add git

WORKDIR /usr/src/app

ADD client/package.json /usr/src/app/
ADD client/package-lock.json /usr/src/app/
RUN npm install

ADD client/ /usr/src/app

RUN npm run build-css
RUN npm run build

FROM golang:alpine
EXPOSE 8000

RUN apk update && apk add git

RUN mkdir -p /go/src/app
WORKDIR /go/src/app

ADD app.go /go/src/app
ADD main.go /go/src/app
ADD views.go /go/src/app
ADD models.go /go/src/app
ADD auth.go /go/src/app
ADD httputils.go /go/src/app
ADD jwtutils.go /go/src/app

RUN go-wrapper download
RUN go-wrapper install

RUN mkdir -p /go/src/app/client/build/
COPY --from=client-builder /usr/src/app/build/ /go/src/app/client/build/

CMD ["go-wrapper", "run"]
