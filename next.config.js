/** @type {import('next').NextConfig} */

// Remote CRA app URL — fallback hardcoded so Vercel always has a value
const REMOTE_APP_URL =
	process.env.NEXT_PUBLIC_REMOTE_APP_URL ||
	'https://d1xospmumlyl1c.cloudfront.net';

const nextConfig = {
	async rewrites() {
		return {
			// beforeFiles: runs BEFORE Next.js checks the filesystem/pages
			// This ensures /logsync is always proxied to the remote CRA app
			
		};
	},
};

module.exports = nextConfig;
