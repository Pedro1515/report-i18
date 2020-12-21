FROM node:12.18.1-slim

EXPOSE 3000

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN echo NEXT_PUBLIC_API_HOST_URL=http://localhost:8082 >> .env 

CMD ["yarn", "dev"]
