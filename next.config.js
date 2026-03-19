/** @type {import('next').NextConfig} */
const REMOTE_APP_URL = process.env.NEXT_PUBLIC_REMOTE_APP_URL;

const nextConfig = {
	async rewrites() {
		// Guard: skip rewrites if remote URL is not configured
		if (!REMOTE_APP_URL) return [];
		return [
			// Proxy the LogSync CRA app — served at root of remote app
			{
				source: '/logsync',
				destination: `${REMOTE_APP_URL}/`,
			},
			// Proxy CRA static assets (JS/CSS bundles)
			{
				source: '/static/:path*',
				destination: `${REMOTE_APP_URL}/static/:path*`,
			},
		];
	},
};

module.exports = nextConfig;
