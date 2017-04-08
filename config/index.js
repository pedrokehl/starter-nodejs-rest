const production = require('./production');
const development = require('./development');

function getConfig() {
  if (process.env.NODE_ENV === 'production') {
      return production;
  }
  return development;
}

module.exports = getConfig();
