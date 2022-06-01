require('dotenv')
const os = require('os')

// @NOTE: Decide on a standard Redis index to use
const REDIS_PROXY_DB_IDX = 4
const REDIS_URL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${REDIS_PROXY_DB_IDX}`

module.exports = {
	apps: [
		{
			port: 5544,
			name: 'pear-connect-proxy',
			script: './node_modules/@colyseus/proxy/bin/proxy',
			instances: 1, // scale this up if the proxy becomes the bottleneck
			exec_mode: 'cluster',
			env: {
				PORT: 80,
				REDIS_URL,
			},
		},
		{
			port: 3100,
			name: 'pear-authority-node',
			script: 'node bin/www', // @NOTE: NEED TO SETUP CONFIG SCRIPT
			watch: false, // optional
			// instances: 4,
			instances: os.cpus().length / 2,
			exec_mode: 'fork', // IMPORTANT: do not use cluster mode.
			env: {
				DEBUG: 'colyseus:errors',
				NODE_ENV: 'production',
			},
		},
	],
}
