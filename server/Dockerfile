FROM node:16

WORKDIR /usr/src/app

ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

CMD npm start