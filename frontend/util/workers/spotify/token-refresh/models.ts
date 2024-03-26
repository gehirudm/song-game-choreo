export interface StartMessage {
    type: "start",
    refreshToken: string,
    tokenTimestamp: Date,
    expiresIn: number
}

export interface RestartMessage {
    type: "restart",
    refreshToken?: string
}

export interface ErrorMessage {
    type: "error"
    explanation: string
}

export interface NewTokenMessage {
    type: "new-token",
    token: string,
    refreshToken: string,
    tokenTimestamp: Date,
    expiresIn: number
}

export type MessageData = StartMessage | RestartMessage | ErrorMessage | NewTokenMessage