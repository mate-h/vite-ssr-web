FROM node:alpine

WORKDIR /usr/app
COPY ./ /usr/app

RUN npm install

ENTRYPOINT [ "npm" ]

CMD ["run", "dev"]