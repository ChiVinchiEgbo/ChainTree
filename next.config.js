module.exports = {
  i18n: {
    locales: ['en', 'pt-BR'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  images: {
    domains: [
      'assets.zipschool.com',
      'cdn.buildspace.so',
      'firebasestorage.googleapis.com',
      'localhost',
    ],
  },
  experimental: {
    esmExternals: false,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
}
