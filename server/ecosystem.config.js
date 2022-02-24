// ecosystem.config.js
const os = require('os')
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
                REDIS_URL: 'redis://127.0.0.1:6379/0',
            },
        },
        {
            port: 3100,
            name: 'pear-authority-node',
            script: 'node bin/www', // your entrypoint file
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
