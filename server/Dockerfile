FROM node:16

WORKDIR /usr/src/app
ARG db_username
ARG db_host
ARG db_password
ARG db_name
ARG gcp_key

ENV GCP_SERVICE_KEY_BASE=$gcp_key
ENV DB_USERNAME=$db_username
ENV DB_HOST=$db_host
ENV DB_PASSWORD=$db_password
ENV DB_NAME=$db_name
ENV PORT 8080
ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

CMD npm start