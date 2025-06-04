/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving
  trailingSlash: false,
  
  // Configure headers for uploaded files
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Configure rewrites for better file serving
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig 