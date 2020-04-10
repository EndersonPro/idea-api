FROM node:12.16.2-alpine3.11 as build
LABEL NAME_APP="idea-api"
LABEL DEVELOPER="Enderson Vizcaino"

COPY . /idea-api
WORKDIR /idea-api

RUN npm i --no-optional --no-shrinkwrap --no-package-lock && npm run build
COPY  .env /idea-api/dist/.env
WORKDIR /idea-api/dist

FROM build

EXPOSE 4000

CMD [ "node", "main.js"]