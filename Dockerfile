FROM node:20 AS build

WORKDIR /MisaFilesFE

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8081

CMD ["npm", "run", "serve"]
