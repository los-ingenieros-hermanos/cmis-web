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
      {
        source: `/${encodeURIComponent('takımlar')}`,
        destination: '/takimlar',
      },
    ];
  },
};

module.exports = nextConfig;
