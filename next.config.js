/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'export', 
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config) => {
    config.module.rules.push(
      ...[
        {
          test: /\.ya?ml$/,
          use: "js-yaml-loader",
        },
        {
          test: /\.svg$/,
          use: "@svgr/webpack",
        },
      ]
    );
    return config;
  },
};

module.exports = nextConfig;
