/** @type {import('next').NextConfig} */
const REMOTE_APP_URL = process.env.NEXT_PUBLIC_REMOTE_APP_URL;

const nextConfig = {
	async rewrites() {
		// Guard: skip rewrites if remote URL is not configured
		if (!REMOTE_APP_URL) return { beforeFiles: [] };
		return {
			// beforeFiles: run BEFORE Next.js checks the filesystem/pages
			// This ensures /logsync is always proxied to the remote CRA app
			beforeFiles: [
				{
					source: '/logsync',
					destination: `${REMOTE_APP_URL}/`,
				},
				{
					source: '/logsync/:path*',
					destination: `${REMOTE_APP_URL}/:path*`,
				},
				// Proxy CRA static assets (JS/CSS bundles)
				{
					source: '/static/:path*',
					destination: `${REMOTE_APP_URL}/static/:path*`,
				},
			],
		};
	},
};

module.exports = nextConfig;
