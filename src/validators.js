/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { getComponentName, getSingularAttribute } = require('./options');

function checkIfArgsHasMessageObject(args) {
  if (args.length !== 1) {
    return false;
  }
  const msgObject = args[0];
  const msgidProp = msgObject.properties.find(prop => prop.key.name === 'id');

  return !!msgidProp;
}

function buildSyntaxError(node, filename, msg) {
  return new SyntaxError(`
    ${filename}:${node.loc.start.line}:${node.loc.start.column + 1}
    
    ${msg}
    `);
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
    const callee = _.get(path, 'node.callee');
    const calleeObject = _.get(callee, 'object');

    if (_.get(callee, 'property.name') === 'message' && _.get(calleeObject, 'object.type') === 'ThisExpression'
      && _.get(calleeObject, 'property.name') === 'props' && _.get(calleeObject, 'property.name') === 'context'
      && checkIfArgsHasMessageObject(path.node.arguments)) {
      throw buildSyntaxError(path.node, opts.filename, 'To use the Pomes Translation Api you should deconstruct the "message" function from the "this.props" or "this.context" and use it separately like message({ id: \'Message ID\' })');
    }
  },
};
