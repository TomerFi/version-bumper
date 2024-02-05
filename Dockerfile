FROM node:21.6.1-bullseye-slim

RUN apt update \
    && apt install -y git \
    && rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /home/node/bumper/
COPY --chown=node:node src package.json package-lock.json /home/node/bumper/
RUN npm install

WORKDIR /repo
RUN git config --global --add safe.directory /repo
ENTRYPOINT ["node", "/home/node/bumper/cli.js"]
