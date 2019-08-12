/* eslint-disable camelcase,no-param-reassign,max-len */
const p = require('path');
const constants = require('./constants');
const {
  getFunctionOptions,
  getComponentName,
  getSingularAttribute,
  getPluralAttribute,
  getContextAttribute,
  getCommentAttribute,
  getFutureAttribute,
} = require('./options');

const {
  validateComponentEntry,
  validateMessageFunctionCall,
  validateMessageComment,
} = require('./validators');

const {
  extractFuncArg,
  extractMessageObjectProps,
  extractFutureAttribute,
} = require('./extractors');

const DEFAULT_CHARSET = 'UTF-8';
const DEFAULT_HEADERS = {
  'content-type': 'text/plain; charset=UTF-8',
  'plural-forms': 'nplurals=2; plural=(n!=1);',
  language: 'en_US',
};

function buildMessageEntry(args, types, path, options) {
  const {
    messageId, messagePluralId, messageContext, messageComment,
  } = extractMessageObjectProps(args, options);

  if (!messageId) {
    return null;
  }

  const entry = {
    [constants.MSG_ID]: extractFuncArg(messageId.value, options.singular, options.name, types, path),
  };

  if (messageContext) {
    entry[constants.MSG_CONTEXT] = extractFuncArg(messageContext.value, options.context, options.name, types, path);
  }

  if (messagePluralId) {
    entry[constants.MSG_PLURAL_ID] = extractFuncArg(messagePluralId.value, options.plural, options.name, types, path);
  }

  if (messageComment) {
    entry.extracted = extractFuncArg(messageComment.value, options.comment, options.name, types, path);
  }

  return entry;
}

function mergeReference(existingReference, newReference) {
  if (existingReference) {
    if (existingReference.includes(newReference)) {
      return existingReference;
    }

    return `${existingReference}\n${newReference}`;
  }

  return newReference;
}

function mergePlural(existingPlural, newPlural) {
  if (existingPlural) return existingPlural;
  return newPlural;
}

function mergeExtracted(existingExtracted, newExtracted) {
  if (existingExtracted) {
    if (existingExtracted === newExtracted) {
      return existingExtracted;
    }
    if (newExtracted && !existingExtracted.startsWith(newExtracted)
      && !existingExtracted.includes(`\n${newExtracted}`)) {
      return `${existingExtracted}\n${newExtracted}`;
    }
    return existingExtracted;
  }
  return newExtracted;
}

function mergeTranslation(existingTranslation, newTranslation) {
  if (existingTranslation && existingTranslation.length === 2) {
    return existingTranslation;
  }
  return newTranslation;
}

function buildReference(entry, state, line = 0) {
  const { includeReference = true, baseReferenceDir } = state.opts;
  if (entry && includeReference) {
    let reference;
    console.log(process.cwd());
    console.log(state.file.opts.filename);
    const rawFilename = p.relative(process.cwd(), state.file.opts.filename);
    const baseReferenceDirRaw = baseReferenceDir;
    if (baseReferenceDirRaw) {
      const baseReferenceDir = `/${baseReferenceDirRaw.replace('/', '')}/`;
      const baseReferenceDirIndex = rawFilename.indexOf(baseReferenceDir);

      if (baseReferenceDirIndex !== -1) {
        reference = rawFilename.substr(
          baseReferenceDirIndex + baseReferenceDir.length, rawFilename.length,
        );
      }
    } else {
      reference = rawFilename;
    }

    if (line) {
      reference += `:${line}`;
    }
    entry.reference = reference;
  }

  return entry;
}

module.exports = {
  buildCallExpressionEntry(types, path, state, opts) {
    const args = path.node.arguments;
    const callee = path.node.callee.name;

    validateMessageFunctionCall(path, opts);

    let entry;
    let options;
    try {
      options = getFunctionOptions(state, callee);
      if (options) {
        const isForFuture = extractFutureAttribute(args, options);
        if (isForFuture) {
          return null;
        }
        entry = buildMessageEntry(args, types, path, options);
        if (entry) {
          validateMessageComment(path, opts, entry);
          return buildReference(entry, state, path.node.loc.start.line);
        }
      }
    } catch (error) {
      if (!options) {
        throw error;
      }
      if (!options.ignoreError) {
        throw error;
      }
    }
    return null;
  },

  buildJSXElementEntry(types, path, state, opts) {
    const element = path.node.openingElement;

    if (element.name.name === getComponentName(state)) {
      if (element.attributes.find((attribute) => attribute.name.name === getFutureAttribute(state))) {
        return null;
      }
      const entry = {};

      element.attributes.forEach((attribute) => {
        if (!attribute.value) {
          return;
        }
        const attributeName = attribute.name.name;
        const attributeValue = attribute.value.value;

        switch (attributeName) {
          case getSingularAttribute(state):
            entry[constants.MSG_ID] = attributeValue;
            break;
          case getPluralAttribute(state):
            entry[constants.MSG_PLURAL_ID] = attributeValue;
            break;
          case getContextAttribute(state):
            entry[constants.MSG_CONTEXT] = attributeValue;
            break;
          case getCommentAttribute(state):
            entry.extracted = attributeValue;
            break;
          default:
            break;
        }
      });

      validateMessageComment(path, opts, entry);
      validateComponentEntry(entry, types, path, state);
      return buildReference(entry, state, path.node.loc.start.line);
    }
    return null;
  },

  mergeEntries(args, entries) {
    const data = {
      charset: args.charset || DEFAULT_CHARSET,
      headers: { ...DEFAULT_HEADERS, ...args.headers },
      translations: {},
    };

    entries.forEach((entry) => {
      const {
        [constants.MSG_ID]: messageId,
        [constants.MSG_PLURAL_ID]: messagePluralId,
        [constants.MSG_CONTEXT]: messageContext,
        extracted: messageComment,
        reference,
      } = entry;
      const context = entry.msgctxt || '';

      const existingContext = data.translations[context];
      if (!existingContext) {
        data.translations[context] = {};
      }

      const existingEntry = data.translations[context][messageId];
      if (!existingEntry) {
        data.translations[context][messageId] = {};
      }

      const existingReference = data.translations[context][messageId].comments
        && data.translations[context][messageId].comments.reference;

      const existingPlural = data.translations[context][messageId][constants.MSG_PLURAL_ID];
      const existingExtracted = data.translations[context][messageId].comments
        && data.translations[context][messageId].comments.extracted;

      const existingTranslation = data.translations[context][messageId][constants.MSG_STR];

      data.translations[context][messageId] = {
        [constants.MSG_ID]: messageId,
        [constants.MSG_CONTEXT]: messageContext,
        [constants.MSG_STR]: mergeTranslation(existingTranslation, messagePluralId ? ['', ''] : ['']),
        [constants.MSG_PLURAL_ID]: mergePlural(existingPlural, messagePluralId),
        comments: {
          reference: mergeReference(existingReference, reference),
          extracted: mergeExtracted(existingExtracted, messageComment),
        },
      };
    });

    return data;
  },

  buildReference,
};
