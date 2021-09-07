FROM registry.digitalservice.id/proxyjds/library/node:14-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3333

CMD [ "npm", "run", "start" ]