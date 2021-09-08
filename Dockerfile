FROM registry.digitalservice.id/proxyjds/library/node:12-slim as base

RUN apt-get update -y -q
RUN apt-get install -y -q wget xvfb libgtk2.0-0 libxtst6 libxss1 libgconf-2-4 libnss3 libasound2 libatk-bridge2.0-0 libxkbcommon-x11-0 
RUN apt-get install -y libgbm-dev libgtk-3-dev

RUN apt-get clean autoclean \
    && apt-get autoremove --yes \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && chown -R pptruser:pptruser node_modules

EXPOSE 3003

USER pptruser

CMD [ "npm", "run", "start" ]
