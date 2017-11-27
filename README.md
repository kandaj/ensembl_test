# Ensembl Test

### Prerequisites:

- [Node.js](https://nodejs.org/en/) version ﻿>= 7.0
- [npm](https://www.npmjs.com/) modules

_package.json_ lists the dependency npm modules to be installed.

### Summary of steps to build app

```
git clone https://github.com/kandaj/ensembl_test

cd ensembl_test

npm install

sudo npm install forever -g
```

### To start sever run the following command:

`forever start src/server.js`


### To stop the server:

`forever stop src/server.js`

### To test the application:

`npm test`
