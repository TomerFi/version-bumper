# Contributing to *version-bumper*

:clap: First, thank you for taking the time to contribute. :clap:

- Fork the repository
- Create a new branch on your fork
- Commit your work
- Create a pull request against the `master` branch

## Project walkthrough

- [src/index.js](src/index.js) is the module's entrypoint.
- [src/cli.js](src/cli.js) is the command line tool execution configuration and entrypoint.
- [src/bumper.js](src/bumper.js) exports the bumper function, figuring out and bumping semantic versions.

## Work Time

```shell
# install required modules
npm install

# lint code
npm run lint

# run unit tests
npm test

# execute the cli tool
node src/cli.js -h

# build the container image
docker build --tag tomerfi/version-bumper:dev .

# run the built image
docker run --rm tomerfi/version-bumper:dev -h
```
