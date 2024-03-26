'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { useGenerateAuthUrl } from "@/util/auth-utils";

export default function SpotifyPage() {
    const authUrl = useGenerateAuthUrl();

    return (
        <div className="flex items-center w-full h-full justify-center">
            <h1>Hello</h1>
            <FaSpotify size={20} />
            {authUrl && <a href={authUrl} className="p-5 bg-blue-600 text-lg text-white">
                Authorize
            </a>}
        </div>
    );
}
