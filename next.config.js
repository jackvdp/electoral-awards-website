/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    // reactStrictMode: true,
    images: {
        domains: [
            'electoralwebsite.s3.eu-west-2.amazonaws.com', 
            'electoralwebsite.s3.amazonaws.com'
        ],
    }
}

module.exports = nextConfig
