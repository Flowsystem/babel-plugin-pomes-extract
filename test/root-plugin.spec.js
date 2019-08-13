const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const plugin = (filename) => babel.transformFileSync(path.join(__dirname, 'fixtures', filename), {
  plugins: [
    [
      path.join(__dirname, '../index.js'),
      {
        outputDir: path.join(__dirname, 'gettext/resources'),
        headers: {
          'po-revision-date': '2019-08-13T07:45:01.119Z',
        },
      },
      '@oneflowab/babel-plugin-pomes-extract',
    ],
  ],
});

const readPotFile = (filename) => fs.readFileSync(path.join(__dirname, 'gettext/resources/test/fixtures', filename), { encoding: 'utf8' });

describe('Pomes Extract Plugin', () => {
  it('extract a message call', () => {
    plugin('message.js');

    const potFileContent = readPotFile('message.js.pot');

    expect(potFileContent.toString()).toMatchSnapshot();
  });

  it('extract a message call with plural form', () => {
    plugin('message-with-plural.js');

    const potFileContent = readPotFile('message-with-plural.js.pot');

    expect(potFileContent.toString()).toMatchSnapshot();
  });

  it('merge a message with singular and plural forms', () => {
    plugin('message-with-singular-and-plural.js');

    const potFileContent = readPotFile('message-with-singular-and-plural.js.pot');

    expect(potFileContent.toString()).toMatchSnapshot();
  });
});
