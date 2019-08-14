const logger = jest.fn();

const loggerFactory = jest.fn(() => ({
  warn: logger,
}));

module.exports = {
  logger,
  loggerFactory,
};
