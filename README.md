[![Follow on Twitter](https://img.shields.io/twitter/follow/pownjs.svg?logo=twitter)](https://twitter.com/pownjs)
[![NPM](https://img.shields.io/npm/v/@pown/cdb.svg)](https://www.npmjs.com/package/@pown/cdb)
[![Fury](https://img.shields.io/badge/version-2x%20Fury-red.svg)](https://github.com/pownjs/lobby)

# Pown CDB

Pown CDB is a Chrome Debug Protocol utility. The main goal of the tool is to automate common tasks to help debug web applications from the command-line and actively monitor and intercept HTTP requests and responses, useful during penetration tests.

| ![screenshot](https://media.githubusercontent.com/media/pownjs/pown-cdb/master/screenshots/01.png) |
|-|

## Credits

This tool is part of [secapps.com](https://secapps.com) open-source initiative.

```
  ___ ___ ___   _   ___ ___  ___
 / __| __/ __| /_\ | _ \ _ \/ __|
 \__ \ _| (__ / _ \|  _/  _/\__ \
 |___/___\___/_/ \_\_| |_|  |___/
  https://secapps.com
```

## Quickstart

This tool is meant to be used as part of [Pown.js](https://github.com/pownjs/pown) but it can be invoked separately as an independent tool.

Install Pown first as usual:

```sh
$ npm install -g pown@latest
```

Invoke directly from Pown:

```sh
$ pown cdb
```

### Library Use

Install this module locally from the root of your project:

```sh
$ npm install @pown/cdb --save
```

Once done, invoke pown cli:

```sh
$ POWN_ROOT=. ./node_modules/.bin/pown-cli cdb
```

You can also use the global pown to invoke the tool locally:

```sh
$ POWN_ROOT=. pown cdb
```

## Usage

> **WARNING**: This pown command is currently under development and as a result will be subject to breaking changes.

```
pown cdb <command>

Chrome Debug Protocol Tool

Commands:
  pown cdb launch   Launch server application such as chrome, firefox, opera and edge
  pown cdb network  Chrome Debug Protocol Network Monitor

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
```

### `pown cdb launch`

```
pown cdb launch

Launch server application such as chrome, firefox, opera and edge

Options:
  --version   Show version number  [boolean]
  --help      Show help  [boolean]
  --port, -p  Remote debugging port  [number] [default: 9222]
```

### `pown cdb network`

```
pown cdb network

Chrome Debug Protocol Network Monitor

Options:
  --version      Show version number  [boolean]
  --help         Show help  [boolean]
  --host, -H     Remote debugging host  [string] [default: "localhost"]
  --port, -p     Remote debugging port  [number] [default: 9222]
  --secure, -s   HTTPS/WSS frontend  [boolean] [default: false]
  --blessed, -b  Start with blessed ui  [boolean] [default: false]
```
