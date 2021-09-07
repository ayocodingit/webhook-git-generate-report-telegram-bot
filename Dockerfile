FROM registry.digitalservice.id/proxyjds/library/node:14

WORKDIR /app

RUN dpkg --add-architecture i386

RUN apt-get update

RUN apt-get install libgtk2.0-0:i386

COPY . .

RUN npm install 

EXPOSE 3333

CMD [ "npm", "run", "start" ]