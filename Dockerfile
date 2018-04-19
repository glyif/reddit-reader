FROM node:carbon
WORKDIR /usr/src/reddit-reader-server
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3030
EXPOSE 9229
