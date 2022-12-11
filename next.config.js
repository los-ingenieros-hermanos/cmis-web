const permanent = false;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: `/${encodeURIComponent('yaklaşan-etkinlikler')}/:path*`,
        destination: '/yaklasan-etkinlikler/:path*',
        permanent,
      },
      {
        source: `/${encodeURIComponent('askıda-proje')}/:path*`,
        destination: '/askida-proje/:path*',
        permanent,
      },
      {
        source: `/${encodeURIComponent('takımlar')}/:path*`,
        destination: '/takimlar/:path*',
        permanent,
      },
      {
        source: '/topluluklar/:id',
        destination: '/topluluklar/:id/gonderiler',
        permanent,
      },
      {
        source: '/takimlar/:id',
        destination: '/takimlar/:id/gonderiler',
        permanent,
      },
      {
        source: `/:base*/${encodeURIComponent('gönderiler')}/:path*`,
        destination: '/:base*/gonderiler/:path*',
        permanent,
      },
      {
        source: `/:base*/${encodeURIComponent('yaklaşan-etkinlikler')}/:path*`,
        destination: '/:base*/yaklasan-etkinlikler/:path*',
        permanent,
      },
      {
        source: `/:base*/${encodeURIComponent('yönetim')}/:path*`,
        destination: '/:base*/yonetim/:path*',
        permanent,
      },
      {
        source: `/:base*/yonetim`,
        destination: '/:base*/yonetim/uyeler',
        permanent,
      },
    ];
  },
};

module.exports = nextConfig;
