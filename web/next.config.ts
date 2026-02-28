import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/impact",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/impact/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
      {
        source: "/labs",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/labs/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
      {
        source: "/projects/limeade",
        destination: "/projects/platform-modernization",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
