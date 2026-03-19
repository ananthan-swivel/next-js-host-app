/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_REMOTE_APP_URL: process.env.NEXT_PUBLIC_REMOTE_APP_URL,
		REMOTE_APP_SECRET: process.env.REMOTE_APP_SECRET,
	},
	assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
	async rewrites() {
		return [
			// Proxy the LogSync CRA app — all routes and static assets under /logsync
			{
				source: '/logsync',
				destination: `${process.env.NEXT_PUBLIC_REMOTE_APP_URL}/logsync`,
			},
			{
				source: '/logsync/:path*',
				destination: `${process.env.NEXT_PUBLIC_REMOTE_APP_URL}/logsync/:path*`,
			},
		];
	},
}

module.exports = nextConfig
