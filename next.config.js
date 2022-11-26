/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/topluluklar/:id',
        destination: '/topluluklar/:id/gönderiler',
        permanent: true,
      },
      {
        source: '/takimlar/:id',
        destination: '/takımlar/:id/gönderiler',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: `/${encodeURIComponent('askıda-proje')}/:path*`,
        destination: '/askida-proje/:path*',
      },
      {
        source: `/${encodeURIComponent('takımlar')}/:path*`,
        destination: '/takimlar/:path*',
      },
      {
        source: `/:base*/${encodeURIComponent('gönderiler')}/:path*`,
        destination: '/:base*/gonderiler/:path*',
      },
      {
        source: `/:base*/${encodeURIComponent('yaklaşan-etkinlikler')}/:path*`,
        destination: '/:base*/yaklasan-etkinlikler/:path*',
      },
      {
        source: `/:base*/${encodeURIComponent('yönetim')}/:path*`,
        destination: '/:base*/yonetim/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
