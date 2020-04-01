FROM node:12.16.1

LABEL NAME_APP="idea-api"
LABEL DEVELOPER="Enderson Vizcaino"

COPY . /idea-api
WORKDIR /idea-api

RUN npm i --no-optional && \
   npm run build

CMD [ "npm", "run", "start:prod" ]