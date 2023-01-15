FROM node:lts

WORKDIR /frontend
COPY package.json .
RUN npm install
COPY ./public ./public
COPY ./src ./src

COPY ./vite.config.js ./vite.config.js
COPY ./index.html ./index.html
COPY ./jsconfig.json ./jsconfig.json
COPY ./node_modules/vue-socket.io ./node_modules/vue-socket.io
COPY ./.editorconfig ./.editorconfig
COPY ./.browserslistrc ./.browserslistrc

CMD npm run dev