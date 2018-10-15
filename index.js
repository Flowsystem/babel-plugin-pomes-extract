/* eslint-disable camelcase,no-shadow */
const { saveEntries } = require('./src/utils');
const { buildCallExpressionEntry, buildJSXElementEntry } = require('./src/builders');

module.exports = ({ types }) => ({
  pre() {
    this.entries = [];
  },
  visitor: {
    CallExpression(path, state) {
      const entry = buildCallExpressionEntry(types, path, state, this.file.opts);
      if (entry) {
        this.entries.push(entry);
      }
    },
    JSXElement(path, state) {
      const entry = buildJSXElementEntry(types, path, state);
      if (entry) {
        this.entries.push(entry);
      }
    },
  },
  post(state) {
    saveEntries(state, this.entries, this.file);
  },
});
