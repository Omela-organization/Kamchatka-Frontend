// next.config.js
/** @type {import('next').NextConfig} */
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
  basePath: process.env.NODE_ENV === 'production' ? '/repository-name' : '',

  async generateBuildId() {
    return 'build-id';
  }
};
