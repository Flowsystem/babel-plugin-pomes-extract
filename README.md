# `babel-plugin-pomes-extract v0.0.6`

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
