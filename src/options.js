/* eslint-disable max-len */

const DEFAULTS = {
  component: {
    name: 'Message',
    singular: 'id',
    plural: 'pluralId',
    context: 'context',
    comment: 'comment',
    future: 'future',
  },
  function: {
    name: 'message',
    singular: 'id',
    plural: 'pluralId',
    context: 'context',
    comment: 'comment',
    future: 'future',
  },
};

function getFunctionOptions(state) {
  return ({ ...DEFAULTS, ...state.opts }).function;
}

function getComponentOptions(state) {
  return { ...DEFAULTS.component, ...(state.opts || {}).component };
}

module.exports = {
  getFunctionOptions: (state, funcName) => {
    const options = getFunctionOptions(state);
    return options.name === funcName && options;
  },

  getComponentName: (state) => getComponentOptions(state).name,

  getSingularAttribute: (state) => getComponentOptions(state).singular,

  getPluralAttribute: (state) => getComponentOptions(state).plural,

  getContextAttribute: (state) => getComponentOptions(state).context,

  getCommentAttribute: (state) => getComponentOptions(state).comment,

  getFutureAttribute: (state) => getComponentOptions(state).future,
};
