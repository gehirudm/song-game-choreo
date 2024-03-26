import { getRefreshToken } from "@/util/auth-utils";
import { MessageData, RestartMessage, StartMessage } from "./models";

console.log('🐝 Worker: Spotify token refresh worker started');

let currentRefreshToken: string = "";
let currentTimeout: ReturnType<typeof setTimeout> | null = null;

const onMessage = (event: MessageEvent<MessageData>) => {
    switch (event.data.type) {
        // Start the webworker process
        case "start":
            handleStart(event.data);
            break;

        // Restart the webworker process    
        case "restart":
            handleRestart(event.data);
            break;

        // Handle unknown events
        default:
            console.log(event);
            break;
    }
};

const handleStart = (data: StartMessage) => {
    const { expiresIn, refreshToken, tokenTimestamp } = data;
    currentRefreshToken = refreshToken;
    startRefreshTokenLoop(tokenTimestamp, expiresIn);
}

const handleRestart = (data: RestartMessage) => {
    const { refreshToken } = data;

    if (!!currentTimeout) clearTimeout(currentTimeout)

    if (currentRefreshToken == "" && !!!refreshToken) 
        postMessage({
            type: "error",
            explanation: "No refresh token"
        })

    if (!!refreshToken) currentRefreshToken = refreshToken
    
    getNewToken()
}

const startRefreshTokenLoop = (tokenTimestamp: Date, expiresIn: number) => {
    const timeDiff = expiresIn - getTimeDifferenceInSeconds(tokenTimestamp); // In seconds

    // Check if token expires withing 1 minute
    if (timeDiff < 60) {
        // Refresh now
        getNewToken()
    } else {
        // Schedule refresh
        setTimeout(() => getNewToken())
    }
}

const getNewToken = () => getRefreshToken(currentRefreshToken)
    .then(({ accessToken, refreshToken, expiresIn }) => {
        currentRefreshToken = refreshToken;

        postMessage({
            type: "new-token",
            token: accessToken,
            refreshToken,
            tokenTimestamp: new Date(),
            expiresIn
        })

        return expiresIn;
    })
    .catch((e: Error) => postMessage({
        type: "error",
        explanation: e.toString()
    }))
    .then((timeout) => {
        currentTimeout = setTimeout(() => {
            getNewToken()
        }, ((timeout ?? 20) - 10) * 1000);
    })

addEventListener('message', onMessage);