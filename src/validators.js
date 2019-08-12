/* eslint-disable no-param-reassign */
const get = require('lodash/get');
const constants = require('./constants');
const { getComponentName, getSingularAttribute } = require('./options');

function checkIfArgsHasMessageObject(args) {
  if (args.length !== 1) {
    return false;
  }
  const msgObject = args[0];
  const msgidProp = msgObject.properties.find((prop) => prop.key.name === 'id');

  return !!msgidProp;
}

function buildSyntaxError(node, filename, msg) {
  return new SyntaxError(`
    ${filename}:${node.loc.start.line}:${node.loc.start.column + 1}

    ${msg}
    `);
}

function buildWarning(node, filename, messageId) {
  console.log(`[pomes-extract]\x1b[33m[MISSING COMMENT][msgid:]\x1b[0m \x1b[43m\x1b[30m"${messageId}"\x1b[0m`);
  console.log(`${filename}:${node.loc.start.line}:${node.loc.start.column + 1}\n`);
}

module.exports = {
  validateComponentEntry(entry, types, path, state) {
    if (!entry.msgid) {
      throw path.buildCodeFrameError(
        `${getComponentName(state)} component must have a prop '${getSingularAttribute(state)}'!`,
      );
    }
  },

  validateMessageFunctionCall(path, opts) {
    const callee = get(path, 'node.callee');
    const calleeObject = get(callee, 'object');

    if (get(callee, 'property.name') === 'message' && get(calleeObject, 'object.type') === 'ThisExpression'
      && get(calleeObject, 'property.name') === 'props' && get(calleeObject, 'property.name') === 'context'
      && checkIfArgsHasMessageObject(path.node.arguments)) {
      throw buildSyntaxError(path.node, opts.filename, 'To use the Pomes Translation Api you should deconstruct the "message" function from the "this.props" or "this.context" and use it separately like message({ id: \'Message ID\' })');
    }
  },

  validateMessageComment(path, opts, entry) {
    const messageId = entry[constants.MSG_ID];
    const messageComment = entry.extracted;

    if (!messageComment) {
      buildWarning(path.node, opts.filename, messageId);
    }
  },
};
