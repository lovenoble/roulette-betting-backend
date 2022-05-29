const { PEAR_SERVER_PORT, NODE_APP_INSTANCE } = process.env

// Used for running multiple processes on a single server instances
export const pearServerPort = Number(PEAR_SERVER_PORT || 3100) + Number(NODE_APP_INSTANCE || 0)
