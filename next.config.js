/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Three.js ships untranspiled ESM in some submodules; let Next handle it.
  transpilePackages: ["three"],
};

module.exports = nextConfig;
