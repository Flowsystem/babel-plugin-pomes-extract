/* eslint-disable no-mixed-operators */
const gettextParser = require('gettext-parser');
const fs = require('fs');
const path = require('path');

const { mergeEntries } = require('./builders');

const PLUGIN_KEY = 'pomes-extract';
const DEFAULT_OUTPUT_FILE = 'resources.pot';

function makeRecursiveDirSync(targetDir, { isRelativeToScript = false } = {}) {
  const { sep } = path;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && targetDir === curDir) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

function saveEntries(state, entries, file) {
  if (entries.length === 0) {
    return;
  }

  const thisPlugin = state.opts.plugins.find(plugin => plugin.key.includes(PLUGIN_KEY));
  const args = (thisPlugin || {}).options;

  const filename = file.opts.filename || 'unknown';
  const currentFileName = path.basename(filename);
  const currentFileDir = path.dirname(filename);
  const outputFile = args.outputFile
    || (filename !== 'unknown' && `${currentFileName}.pot`)
    || DEFAULT_OUTPUT_FILE;
  let outputDir = args.outputDir || __dirname;
  outputDir = path.resolve(outputDir, path.relative(process.cwd(), currentFileDir));

  if (!fs.existsSync(outputDir)) {
    makeRecursiveDirSync(outputDir);
  }

  const poRawData = mergeEntries(args, entries);
  const po = gettextParser.po.compile(poRawData);

  fs.writeFileSync(path.join(outputDir, outputFile), po);
}

module.exports = {
  saveEntries,
};
