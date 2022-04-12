import mongoose from 'mongoose'
import { reactiveEnum, ReactiveEnum } from '@ngbites/reactive-enum'

import { storeUri } from './config'
const {
    MONGO_ROOT_USERNAME,
    MONGO_ROOT_PASSWORD,
} = process.env

export enum ConnectionStatus {
    Connected = 'connected',
    NotConnected = 'not connected',
    Disconnected = 'disconnected',
    Establishing = 'establishing',
    Failed = 'failed',
}

class StoreConnection {
    public mongoUrl: string

    private _reactiveStatus: ReactiveEnum<typeof ConnectionStatus> =
        reactiveEnum(ConnectionStatus, {
            initialValue: ConnectionStatus.NotConnected,
        })

    public constructor() {
        this.mongoUrl = storeUri || 'mongodb://localhost:27017/game-state'

        // Define mongoose global settings
        // mongoose.Promise = global.Promise
        mongoose.set('overwriteModels', false)
        mongoose.set('autoIndex', true)

        // Define mongoose event callbacks
        mongoose.connection.on('disconnected', () => {
            this._reactiveStatus.set(ConnectionStatus.Disconnected)
        })
    }

    public statusObserver(callback)  {
        this._reactiveStatus.value$.subscribe(callback)
    }

    public getStatus() {
        return this._reactiveStatus.value()
    }

    public async connect() {
        try {
            const status: string = this._reactiveStatus.value()
            if (status === ConnectionStatus.Connected) {
                return 'Store is already connected.'
            }

            this._reactiveStatus.set(ConnectionStatus.Establishing)
            await mongoose.connect(this.mongoUrl, {
                auth: {
                    username: MONGO_ROOT_USERNAME,
                    password: MONGO_ROOT_PASSWORD,
                },
                authSource: 'admin', // @NOTE this should be in an environment variable
            })
            this._reactiveStatus.set(ConnectionStatus.Connected)
        } catch (err) {
            this._reactiveStatus.set(ConnectionStatus.Failed)
            throw new Error(err.toString())
        }
    }
}

const storeConnection = new StoreConnection()

export default storeConnection
