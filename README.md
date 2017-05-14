# monorepo

A CLI utility program for Node.js monorepo projects.

```sh
yarn add monorepo --dev
```

[![build status](https://img.shields.io/travis/mariuslundgard/monorepo/master.svg?style=flat-square)](https://travis-ci.org/mariuslundgard/monorepo)
[![npm version](https://img.shields.io/npm/v/monorepo.svg?style=flat-square)](https://www.npmjs.com/package/monorepo)

## Features

* Based on `yarn`.
* Parallel. Runs scripts in packages in parallel.

## Motivation

[`lerna`](https://github.com/lerna/lerna) is pretty good, but seems bloated and messes up the output to stdout.
Also, `lerna` uses `npm` which has [speed issues](https://github.com/npm/npm/issues/15361).
 
## Usage

Add a `monorepo.json` to the root of the project. Example:

```json
{
  "packages": [
    "packages/*"
  ]
}
```

To install all the sub-package dependencies, run:

```sh
monorepo install
```

To run the `test` script in each of the packages, run:

```sh
monorepo run test
```
