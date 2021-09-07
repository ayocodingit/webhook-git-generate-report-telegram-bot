FROM registry.digitalservice.id/proxyjds/library/node:14

WORKDIR /app

RUN apt-get update

RUN echo "deb http://old-releases.ubuntu.com/ubuntu/ raring main restricted universe multiverse" > ia32-libs-raring.list

RUN apt-get install ia32-libs

COPY . .

RUN npm install 

EXPOSE 3333

CMD [ "npm", "run", "start" ]