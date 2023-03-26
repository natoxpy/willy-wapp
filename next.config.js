const withPWA = require("next-pwa");
const withPlugins = require("next-compose-plugins");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
});

const config = withPWA({
    dest: "public",
});

module.exports = config;

// module.exports = withPlugins([
//     withPWA({
//         dest: "public",
//     }),
//     withBundleAnalyzer({
//         reactStrictMode: false,
//         eslint: {
//             ignoreDuringBuilds: true,
//         },
//     }),
// ]);
