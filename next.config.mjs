/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      // {
      //   protocol: "https",
      //   hostname: "sleek-capybara-771.convex.cloud",
      // },
    ],
  },
};

export default nextConfig;
