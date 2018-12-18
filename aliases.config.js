const path = require('path');

const aliases = {
  '@components': 'src/components',
  '@assets': 'src/assets',
  '@store': 'src/store',
  '@plugins': 'src/plugins',
};

module.exports = {
  webpack: {},
};

function resolveSrc(_path) {
  return path.resolve(__dirname, _path);
}

Object.keys(aliases).forEach((alias) => {
  const aliasTo = aliases[alias];
  module.exports.webpack[alias] = resolveSrc(aliasTo);
});
