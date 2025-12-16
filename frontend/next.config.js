/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force rebuild
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com', 'yt3.ggpht.com', 'via.placeholder.com'],
  },
}

module.exports = nextConfig
