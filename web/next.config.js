/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    images: {
        domains: [
            'electoralwebsite.s3.eu-west-2.amazonaws.com',
            'electoralwebsite.s3.amazonaws.com',
            '4y9kpertpu07sqtv.public.blob.vercel-storage.com',
            't3.ftcdn.net',
            't4.ftcdn.net',
            'as2.ftcdn.net',
            'images.unsplash.com'
        ],
    },
    // Bundle the admin-only comms-plan .eml templates (read at runtime by
    // pages/api/comms-templates/[filename].ts) into the serverless function.
    outputFileTracingIncludes: {
        '/api/comms-templates/[filename]': ['./src/data/comms-templates/**'],
    },
}

module.exports = nextConfig
