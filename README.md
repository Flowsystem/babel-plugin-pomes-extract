# `babel-plugin-pomes-extract`
[![Build Status](https://travis-ci.org/Flowsystem/babel-plugin-pomes-extract.svg?branch=master)](https://travis-ci.org/Flowsystem/babel-plugin-pomes-extract)
[![codecov](https://codecov.io/gh/Flowsystem/babel-plugin-pomes-extract/branch/master/graph/badge.svg)](https://codecov.io/gh/Flowsystem/babel-plugin-pomes-extract)
[![npm version](https://badge.fury.io/js/%40oneflowab%2Fbabel-plugin-pomes-extract.svg)](https://www.npmjs.com/package/@oneflowab/babel-plugin-pomes-extract)
![downloads](https://img.shields.io/npm/dm/@oneflowab/babel-plugin-pomes-extract.svg)

Babel plugin to extract strings from React components in which Pomes Translation API has been used and gettext-like functions into a gettext POT file.

## Usage

```
yarn add @oneflowab/babel-plugin-pomes-extract
```

Then you could configure the babel plugin like below:

```javascript
module.exports = {
  presets: [
    //...
  ],
  plugins: [
    //...
    ['@oneflowab/babel-plugin-pomes-extract', {
      outputDir: 'translations',
      headers: {
        'po-revision-date': new Date().toISOString(),
      },
    }],
  ],
};

```
