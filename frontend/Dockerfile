FROM node:carbon
WORKDIR /usr/src/reddit-reader-client
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
