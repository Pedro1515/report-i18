FROM node:12.18.1-slim

EXPOSE 3000

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

CMD ["bash", "env.sh"]