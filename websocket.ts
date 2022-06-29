import http from 'http'
import WebSocket from 'ws';
import {authenticateWS} from "../middlewares/session";
import qs from 'query-string'
import httpStatus from "http-status-codes";

export class WebSocketServerManager {
    private static connections = new Map<string, WebSocket.WebSocket>();
    static add(username: string, ws: WebSocket.WebSocket) {
        WebSocketServerManager.connections.set(username, ws);
    }
    private static get(username: string): WebSocket.WebSocket {
        const ws = WebSocketServerManager.connections.get(username);
        if (!ws) {
            throw 'internal web socket server error';
        }
        return ws;
    }
    static sendTo(username: string, msg: string) {
        try {
            const ws = WebSocketServerManager.get(username);
            ws.send(msg);
        } catch (e) {
            console.log(e);
        }
    }
    static sendOK(username: string) {
        WebSocketServerManager.sendTo(username, JSON.stringify({status: httpStatus.OK, message: `${username} was validated successfully`}));
        WebSocketServerManager.close(username);
    }
    static close(username: string) {
        try {
            const ws = WebSocketServerManager.get(username);
            ws.close();
        } catch (e) {} finally {
            WebSocketServerManager.connections.delete(username);
        }
    }
}

// https://www.npmjs.com/package/ws
export function attachWebSocketServer(httpServer: http.Server): WebSocket.Server {
    let wsServer = new WebSocket.Server({noServer: true, path: '/api/1/patients/validate/ws'});

    httpServer.on('upgrade', (request, socket, head) => {
        try {
            authenticateWS(request);
        } catch(e) {
            socket.destroy();
            return;
        }
        wsServer.handleUpgrade(request, socket, head, (websocket) => {
            wsServer.emit('connection', websocket, request);
        });
    });

    wsServer.on('connection', function connection(connection, req) {
        const url = req.url || '';
        let params = <{username:string}>qs.parse(url.split('?')[1]);
        if (!params.username) {
            connection.send(JSON.stringify({status: httpStatus.BAD_REQUEST, message: 'username param is required'}));
            connection.close();
        }
        WebSocketServerManager.add(params.username, connection);
        connection.send(JSON.stringify({status: httpStatus.OK, message: 'Connection accepted, waiting for user input'}));
    });

    return wsServer;
}