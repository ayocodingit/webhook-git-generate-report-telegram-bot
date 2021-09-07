FROM registry.digitalservice.id/proxyjds/library/node:14

WORKDIR /app

RUN apt-get install ia32-libs-gtk

COPY . .

RUN npm install 

EXPOSE 3333

CMD [ "npm", "run", "start" ]