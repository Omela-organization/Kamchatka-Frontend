// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@types/node'] = '@types/node';
    }
    config.module.rules.push({
      test: /\.geojson$/,
      use: 'raw-loader',
    });
    return config;
  },
};
