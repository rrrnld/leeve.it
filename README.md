# [leeve.it](http://www.leeve.it/) API [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This repository contains all the source code and documentation necessary to get a backend powering the breadcrumbs localized messenger up and running. It consists of multiple API endpoints handling authentication and authorization for sending and retrieving encrypted messages between two persons.

## Installation

In order to install the API you need [node](http://nodejs.org/) (version 0.10 is used for development at the moment). In order to install all the dependencies open your terminal and run

```
$ npm install
```

in the directory of this repository. Starting the server is done by running

```
$ node index.js
```

## Tests

All tests are located inside the diretory `test`. They are written using [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai). To run them enter

```
$ npm test-server
```

and in another terminal

```
$ npm test
```

Additionally this makes sure that all JS files pass the [JS standard coding style](https://github.com/feross/standard) in order to ensure consistent formatting of source code. To help with this there also is a [.editorconfig](http://editorconfig.org/) file located in the root of this project.

## SSL / TLS

This server should only be run with a secure connection. In order to provide the necessary certificate and private key when running the server, place it inside the `sslcert` folder with the name `server.key` and `server.crt` respectively. If you are running this from your `localhost` (e.g. for development purposes), you can create a self-signed certificate and a key using the following commands (assuming you are on a Mac, based on [this guide](http://www.akadia.com/services/ssh_test_certificate.html)):

```
$ cd sslcert
$ openssl genrsa -out server.key 1024
$ openssl req -new -key server.key -out server.csr
$ openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

The `sslcert` directory should contain the four files `server.crt`, `server.csr`, `server.key` and `server.key.org` afterwards.
