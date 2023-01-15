FROM node:lts

WORKDIR /backend
COPY package.json .
RUN npm install
COPY ./src ./src
COPY ./test ./test
COPY ./server.js ./server.js
CMD npm start