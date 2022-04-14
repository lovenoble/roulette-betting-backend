/// <reference types="react-scripts" />
/// <reference types="colyseus.js/lib/index.d.ts" />
/// <reference types="ethers/lib/index.d.ts" />
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test'
        PUBLIC_URL: string
    }
}

interface Window {
    ethereum: any
}
