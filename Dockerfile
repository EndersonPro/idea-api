FROM node:12.16.1

COPY . /idea-api

RUN npm i -g @nestjs/cli