import { useEffect, useState } from "react";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
const redirectUri = 'http://localhost:3000/spotify/redirect';
const scope = 'user-read-private user-read-email';

const authUrl = new URL("https://accounts.spotify.com/authorize")
const tokenURL = new URL("https://accounts.spotify.com/api/token")

const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export const generateCodeChallenge = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    return {
        codeVerifier,
        codeChallenge: base64encode(hashed)
    };
}

const generateAuthUrl = async () => {
    const { codeVerifier, codeChallenge } = await generateCodeChallenge();

    // generated in the previous step
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    return authUrl.toString();
}

export const useGenerateAuthUrl = () => {
    const [authUrl, setAuthUrl] = useState<string>();

    useEffect(() => {
        generateAuthUrl()
            .then(url => setAuthUrl(url))
    }, [])

    return authUrl;
}

export const getToken = async (code: string) => {

    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier') ?? "";

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    }

    const body = await fetch(tokenURL, payload);
    const response = await body.json();

    localStorage.setItem('access_token', response.access_token);

    return response.access_token;
}

export const getRefreshToken = async (refreshToken: string) => {
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId
        }),
    }

    const body = await fetch(tokenURL, payload);
    const response = await body.json();

    return {
        accessToken: response.accessToken as string,
        refreshToken: response.refreshToken as string,
        expiresIn: response.expiresIn as number
    }
}