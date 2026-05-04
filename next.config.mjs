import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'static.mollie.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mollie.com',
      },
      {
        protocol: 'https',
        hostname: 'mollie.com',
      },
      {
        protocol: 'https',
        hostname: 'gcluomrthdmafymqjzkj.supabase.co',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
