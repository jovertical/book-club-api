FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
