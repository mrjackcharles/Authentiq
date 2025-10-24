/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce a minimal server build suited for Node runtimes (e.g., Amplify SSR)
  output: 'standalone',
};

export default nextConfig;
