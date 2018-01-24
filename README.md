# monorepo

A CLI utility program for Node.js monorepo projects.

```sh
npm install monorepo --save-dev
```

[![build status](https://img.shields.io/travis/mariuslundgard/monorepo/master.svg?style=flat-square)](https://travis-ci.org/mariuslundgard/monorepo)
[![npm version](https://img.shields.io/npm/v/monorepo.svg?style=flat-square)](https://www.npmjs.com/package/monorepo)

## Features

* **Adapters**. Use either `npm` (default) or `yarn`.
* **Parallel.** Runs package scripts and commands in parallel.

## Motivation

[`lerna`](https://github.com/lerna/lerna) is pretty good, but seems bloated and messes up the output to stdout.

## Usage

Add a `monorepo.json` to the root of the project. Example:

```json
{
  "adapter": "npm",
  "packages": ["packages/*"]
}
```

To install all the sub-package dependencies, run:

```sh
monorepo install
```

To publish all the sub-package dependencies, run:

```sh
monorepo publish
```

To run the `test` script in each of the packages, run:

```sh
monorepo run test
```

## API

### `monorepo(args, flags, opts, cb)`

`monorepo` may be used as a Node.js module:

```js
const monorepo = require('monorepo')

monorepo(
  ['test'],
  {adapter: 'yarn', quiet: true},
  {cwd: path.resolve(__dirname, 'path/to/root')},
  err => {
    if (err) {
      console.error(err.message)
      process.exit(err.code || 1)
    }
  }
)
```
