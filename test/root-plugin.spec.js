const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const plugin = (filename) => babel.transformFileSync(path.join(__dirname, 'fixtures', filename), {
  presets: [
    '@babel/preset-react',
  ],
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
  describe('#message', () => {
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

    xit('raise warning for message without comment', () => {
      const oldLog = console.log;
      console.log = jest.fn();
      plugin('message-without-comment.js');

      const potFileContent = readPotFile('message-without-comment.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();

      expect(console.log.mock.calls).toMatchSnapshot();
      console.log = oldLog;
    });
  });

  describe('<Message />', () => {
    it('extract a Message component', () => {
      plugin('message-component.js');

      const potFileContent = readPotFile('message-component.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });

    it('extract a message call with plural form', () => {
      plugin('message-component-with-plural.js');

      const potFileContent = readPotFile('message-component-with-plural.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });

    it('merge a message with singular and plural forms', () => {
      plugin('message-component-with-singular-and-plural.js');

      const potFileContent = readPotFile('message-component-with-singular-and-plural.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });
  });
});
