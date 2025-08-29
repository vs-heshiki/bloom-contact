FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 7545
CMD ["npm", "start"]
