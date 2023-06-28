FROM node:18.14.0

WORKDIR /app

ENV NODE_ENV = production

COPY package*.json ./

RUN npm ci --include=dev

COPY . .

EXPOSE 4545

CMD ["npm","run", "dev" ]
