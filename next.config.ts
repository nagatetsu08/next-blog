import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb' //uploadできるファイルのサイズを少し拡張
    }
  },
  eslint: {
    // この設定でビルド時にESLintエラー・警告があっても無視されます
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
