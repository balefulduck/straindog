/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.leafly.com',
      },
      {
        protocol: 'https',
        hostname: 'leafly-public.imgix.net',
      },
      {
        protocol: 'https',
        hostname: 'www.philosopherseeds.com',
      },
      {
        protocol: 'https',
        hostname: 'shop.greenhouseseeds.nl',
      },
      {
        protocol: 'https',
        hostname: 'www.cannaconnection.de',
      },
      {
        protocol: 'https',
        hostname: 'www.ripperseeds.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.nordlandseeds.dk',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
      },
      {
        protocol: 'https',
        hostname: 'www.royalqueenseeds.de',
      },
      {
        protocol: 'https',
        hostname: 'seedstockers.de',
      },
      {
        protocol: 'https',
        hostname: 'www.exoticseed.eu',
      },
      {
        protocol: 'https',
        hostname: 'img.sensiseeds.com',
      },
      {
        protocol: 'https',
        hostname: 'www.zamnesia.com',
      },
      {
        protocol: 'https',
        hostname: 'oaseeds.com',
      }
    ],
  },
};

export default nextConfig;
