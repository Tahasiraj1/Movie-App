/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
                port: "",
            },
        ],
        domains: ['image.tmdb.org'],
    },
};

export default nextConfig;