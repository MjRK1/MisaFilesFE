FROM node:20 AS build

WORKDIR /MisaFilesFE

ARG PROD_HOST
ARG IS_PROD
ARG HOST
ARG IS_PROD
ARG PORT

ENV PROD_HOST=MisaFilesFE
ENV IS_PROD=true
ENV HOST=0.0.0.0
ENV IS_PROD=true
ENV PORT=8081

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8081

CMD ["npm", "run", "serve"]
