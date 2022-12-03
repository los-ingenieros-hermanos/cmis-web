/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: `/${encodeURIComponent('yaklaşan-etkinlikler')}/:path*`,
        destination: '/yaklasan-etkinlikler/:path*',
        permanent: true,
      },
      {
        source: `/${encodeURIComponent('askıda-proje')}/:path*`,
        destination: '/askida-proje/:path*',
        permanent: true,
      },
      {
        source: `/${encodeURIComponent('takımlar')}/:path*`,
        destination: '/takimlar/:path*',
        permanent: true,
      },
      {
        source: '/topluluklar/:id',
        destination: '/topluluklar/:id/gonderiler',
        permanent: true,
      },
      {
        source: '/takimlar/:id',
        destination: '/takimlar/:id/gonderiler',
        permanent: true,
      },
      {
        source: `/:base*/${encodeURIComponent('gönderiler')}/:path*`,
        destination: '/:base*/gonderiler/:path*',
        permanent: true,
      },
      {
        source: `/:base*/${encodeURIComponent('yaklaşan-etkinlikler')}/:path*`,
        destination: '/:base*/yaklasan-etkinlikler/:path*',
        permanent: true,
      },
      {
        source: `/:base*/${encodeURIComponent('yönetim')}/:path*`,
        destination: '/:base*/yonetim/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
