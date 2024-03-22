import ballerina/io;
import ballerina/websocket;

service /ws on new websocket:Listener(9090) {
    resource function get .() returns websocket:Service|websocket:UpgradeError {
        return new WsService();
    }
}

service class WsService {
    *websocket:Service;
    remote function onMessage(websocket:Caller caller, string data) returns websocket:Error? {
        io:println(data);
        check caller->writeTextMessage(data);
    }
}
