/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: `/${encodeURIComponent('askıda-proje')}`,
        destination: '/askida-proje',
      },
    ];
  },
};

module.exports = nextConfig;
