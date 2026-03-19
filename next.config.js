/** @type {import('next').NextConfig} */

// Remote CRA app URL — fallback hardcoded so Vercel always has a value
const REMOTE_APP_URL =
	process.env.NEXT_PUBLIC_REMOTE_APP_URL ||
	'https://react-host-app-henna.vercel.app';

const nextConfig = {
	async rewrites() {
		return {
			// beforeFiles: runs BEFORE Next.js checks the filesystem/pages
			// This ensures /logsync is always proxied to the remote CRA app
			beforeFiles: [
				// Proxy CRA app root (index.html) when visiting /logsync
				{
					source: '/logsync',
					destination: `${REMOTE_APP_URL}/`,
				},
				// Proxy CRA static JS/CSS bundles requested by the browser
				{
					source: '/static/:path*',
					destination: `${REMOTE_APP_URL}/static/:path*`,
				},
			],
		};
	},
};

module.exports = nextConfig;
