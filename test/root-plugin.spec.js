const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const { logger } = require('./support/logger');

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

    it('split messages with context', () => {
      plugin('message-with-singular-plural-and-context.js');

      const potFileContent = readPotFile('message-with-singular-plural-and-context.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });

    it('raise warning for message without comment', () => {
      plugin('message-without-comment.js');

      const potFileContent = readPotFile('message-without-comment.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
      expect(logger).toHaveBeenNthCalledWith(1, '[pomes-extract]\x1b[33m[MISSING COMMENT][msgid:]\x1b[0m \x1b[43m\x1b[30m"foo"\x1b[0m');
      expect(logger).toHaveBeenNthCalledWith(2, 'babel-plugin-pomes-extract/test/fixtures/message-without-comment.js:3:1\n');
    });

    it('skip creating pot files for messages with future', () => {
      plugin('message-future.js');

      const filePath = path.join(__dirname, 'gettext/resources/test/fixtures/message-future.js.pot');

      expect(fs.existsSync(filePath)).toBe(false);
    });
  });

  describe('<Message />', () => {
    it('extract a Message component', () => {
      plugin('message-component.js');

      const potFileContent = readPotFile('message-component.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });

    it('extract a Message component with plural form', () => {
      plugin('message-component-with-plural.js');

      const potFileContent = readPotFile('message-component-with-plural.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });

    it('merge a Message component with singular and plural forms', () => {
      plugin('message-component-with-singular-and-plural.js');

      const potFileContent = readPotFile('message-component-with-singular-and-plural.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });

    it('split Messages with context', () => {
      plugin('message-component-with-singular-plural-and-context.js');

      const potFileContent = readPotFile('message-component-with-singular-plural-and-context.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
    });

    it('raise warning for Message component without comment', () => {
      plugin('message-component-without-comment.js');

      const potFileContent = readPotFile('message-component-without-comment.js.pot');

      expect(potFileContent.toString()).toMatchSnapshot();
      expect(logger).toHaveBeenNthCalledWith(1, '[pomes-extract]\x1b[33m[MISSING COMMENT][msgid:]\x1b[0m \x1b[43m\x1b[30m"foo"\x1b[0m');
      expect(logger).toHaveBeenNthCalledWith(2, 'babel-plugin-pomes-extract/test/fixtures/message-component-without-comment.js:1:1\n');
    });

    it('skip creating pot files for Message with future', () => {
      plugin('message-component-future.js');

      const filePath = path.join(__dirname, 'gettext/resources/test/fixtures/message-component-future.js.pot');

      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('raise exception if using this.props.message (instead of destructuring props)', () => {
      expect(() => {
        plugin('message-component-with-props.js');
      }).toThrowError();
    });

    it('raise exception if Message does not have an id', () => {
      expect(() => {
        plugin('message-component-without-id.js');
      }).toThrowError();
    });
  });
});
