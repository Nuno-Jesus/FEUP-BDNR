FROM node:19-alpine

RUN mkdir -p /usr/app/
WORKDIR /usr/app/

RUN ls -la
COPY package.json ./

RUN npm install

COPY tsconfig.json .
COPY tsconfig.node.json .
COPY tsconfig.app.json .
COPY eslint.config.js .
COPY vite.config.ts .

COPY index.html .

CMD ["npm", "run", "dev"]

