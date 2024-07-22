FROM node:22.5.1-bullseye-slim

RUN apt update && apt install -y git && rm -rf /var/lib/apt/lists/*

USER node

WORKDIR /home/node/bumper/
COPY --chown=node:node package.json package-lock.json ./
RUN npm install
COPY --chown=node:node src src

WORKDIR /repo
RUN git config --global --add safe.directory /repo
ENTRYPOINT ["node", "/home/node/bumper/src/cli.js"]
