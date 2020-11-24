FROM node:lts

WORKDIR /app
ENTRYPOINT [ "/app/bin/www" ]
EXPOSE 3000

COPY . /app

RUN npx yarn install
