import { TransportOptions } from '@colyseus/uwebsockets-transport'
import type {
  WebSocket,
  HttpResponse,
  HttpRequest,
  WebSocketBehavior,
  AppOptions,
} from 'uWebSockets.js'

export type { WebSocketBehavior } from 'uWebSockets.js'

export type RouteHandler = (res: HttpResponse, req: HttpRequest) => void

export interface IRouteController {
  http?: {
    [routeName: string]: RouteHandler
  }
  ws?: {
    [routeName: string]: WebSocketBehavior<{}>
  }
}

export interface ITransportOptions {
  transportOpts?: TransportOptions
  appOpts?: AppOptions
  pearMonitorPort?: number | string
}

export type WSHandler = (ws: WebSocket<{}>, message: ArrayBuffer, isBinary: boolean) => void
