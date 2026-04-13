/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // Add Supabase storage domain if you use it for images
      'your-project.supabase.co',
    ],
  },
}

module.exports = nextConfig
