import ballerina/http;
import ballerina/io;
import ballerina/websocket;

service /ws on new websocket:Listener(9090) {
    resource function get .() returns websocket:Service|websocket:UpgradeError {
        return new WsService();
    }
}

service / on new http:Listener(4444) {
    resource function get sse(http:Caller caller) returns error? {
        http:Response response = new;
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");

        check caller->respond(response);

        int i = 0;
        while i < 10 {
            http:Response eventResponse = new;
            eventResponse.setPayload(string `event: number\ndata: ${i}\n\n`);
            check caller->respond(eventResponse);
            i += 1;
        }
    }
}

service class WsService {
    *websocket:Service;
    remote function onMessage(websocket:Caller caller, string data) returns websocket:Error? {
        io:println(data);
        check caller->writeTextMessage(data);
    }
}

public function main() {
    io:println("Starting Websocket server on 127.0.0.1:9090");
}
