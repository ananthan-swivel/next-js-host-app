/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_REMOTE_APP_URL: process.env.NEXT_PUBLIC_REMOTE_APP_URL,
		REMOTE_APP_SECRET: process.env.REMOTE_APP_SECRET,
	},
	assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
	async rewrites() {
		return [
			{
				source: '/remote/:path*',
				destination: `${process.env.NEXT_PUBLIC_REMOTE_APP_URL}/:path*`,
			},
			{
				source: '/remote-static/:path*',
				destination: `${process.env.NEXT_PUBLIC_REMOTE_APP_URL}/remote-static/:path*`,
			},
		];
	},
}

module.exports = nextConfig
