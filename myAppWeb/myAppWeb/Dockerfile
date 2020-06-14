FROM node:12-alpine

WORKDIR /myAppWeb/myAppWeb

COPY package.json .
COPY yarn.lock .

RUN yarn install --silent

COPY . .
