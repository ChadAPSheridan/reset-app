// filepath: /home/chads/Projects/reset-app/frontend/next.config.js
export default {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://localhost:3000/:path*', // Corrected proxy to Backend
      },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });
    return config;
  },
};