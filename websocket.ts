import http from 'http'
import WebSocket from 'ws';
import {authenticateWS, authenticateWSHTTP} from "../middlewares/session";
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

    static sendMessage(username: string, msg: string) {
        try {
            const ws = WebSocketServerManager.get(username);
            ws.send(msg);
        } catch (e) {
            WebSocketServerManager.close(username);
        }
    }

    static sendOK(username: string) {
        WebSocketServerManager.sendMessage(username, JSON.stringify({status: httpStatus.OK, message: `${username} was validated successfully`}));
        WebSocketServerManager.close(username);
    }

    static sendMessageBroadcastByPattern(pattern: string, message: string) {
        for (const [key, ws] of WebSocketServerManager.connections) {
            if (key.startsWith(pattern)) {
                try {
                    ws.send(message);
                } catch {
                    // Si se perdió la conexión o tira un error al ejecutar el método send, cierra la conexión y elimina el ws del map
                    WebSocketServerManager.close(key);
                }
            }
        }
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

export class WebSocketServerWebService {
    public static ALERTS_DASHBOARD_PATTERN: string = 'ALERTS_DASHBOARD_'
    constructor(httpServer: http.Server) {
        let wsAlertsDashboard = new WebSocket.Server({noServer: true, path: '/api/1/patient-history/refresh/ws'});

        httpServer.on('upgrade', (request, socket, head) => {
            wsAlertsDashboard.handleUpgrade(request, socket, head, (websocket) => {
                wsAlertsDashboard.emit('connection', websocket, request);
            });
        });

        wsAlertsDashboard.on('connection', async function connection(connection, req) {
            let sess;
            try {
                sess = await authenticateWSHTTP(req);
            } catch(e) {
                connection.close();
                return;
            }
            const key = `${WebSocketServerWebService.ALERTS_DASHBOARD_PATTERN}${sess.access_token}`;
            WebSocketServerManager.add(key, connection);
            connection.send(JSON.stringify({status: httpStatus.OK, message: 'connection accepted, waiting for updates'}));
        });
    }
}

export class WebSocketServerUserService {
    constructor(httpServer: http.Server) {
        let wsServer = new WebSocket.Server({noServer: true, path: '/api/1/patients/validate/ws'});

        httpServer.on('upgrade', (request, socket, head) => {
            wsServer.handleUpgrade(request, socket, head, (websocket) => {
                try {
                    authenticateWS(request);
                } catch(e) {
                    socket.destroy();
                    return;
                }
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
            connection.send(JSON.stringify({status: httpStatus.OK, message: 'connection accepted, waiting for user input'}));
        });
    }
}