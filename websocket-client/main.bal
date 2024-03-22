import ballerina/websocket;
import ballerina/io;

public function main() returns error? {
   websocket:Client wsClient = check new("ws://127.0.0.1:9090/ws");

   check wsClient->writeMessage("Test Message");

   string textResp = check wsClient->readMessage();
   io:println("Message from Client" + textResp);
}