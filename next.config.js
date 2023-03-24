const withPWA = require("next-pwa");

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    dest: "public",
});

module.exports = nextConfig;
