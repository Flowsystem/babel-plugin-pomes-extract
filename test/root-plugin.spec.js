const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const plugin = (filename) => babel.transformFileSync(filename, {
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

describe('Pomes Extract Plugin', () => {
  it('extract a message call', () => {
    plugin(path.join(__dirname, 'fixtures/file-with-message.js'));

    const potFileContent = fs.readFileSync(path.join(__dirname, 'gettext/resources/test/fixtures/file-with-message.js.pot'), { encoding: 'utf8' });

    expect(potFileContent.toString()).toMatchSnapshot();
  });
});
