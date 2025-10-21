/** biome-ignore-all lint/suspicious/useAwait: needed as per https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects */
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/experiment",
        permanent: true,
      },
    ];
  },
  transpilePackages: ["@parametric-ai/ui"],
};

export default nextConfig;
