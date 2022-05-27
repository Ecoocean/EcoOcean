FROM node:16

WORKDIR /usr/src/app
ARG gcp_json_key
ENV FIREBASE_SERVICE_KEY=${gcp_json_key}
ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

CMD npm start