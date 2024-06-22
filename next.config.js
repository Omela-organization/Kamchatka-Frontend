// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  basePath: '/Kamchatka-frontend',
  assetPrefix: '/Kamchatka-frontend/',
  plugins: {
    'postcss-import': {},
    autoprefixer: {},
  },
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
  basePath: process.env.NODE_ENV === 'production' ? '/Kamchatka-frontend' : '',

  async generateBuildId() {
    return 'build-id';
  }
};
