// next.config.js
module.exports = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  basePath: '/Kamchatka-Frontend',
  assetPrefix: '/Kamchatka-Frontend/',
  trailingSlash: true,
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
