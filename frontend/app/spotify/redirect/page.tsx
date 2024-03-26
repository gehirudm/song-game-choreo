'use client'

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { RedirectType, redirect, useSearchParams } from "next/navigation";
import { getToken } from "@/util/auth-utils";

export default function SpotifyRedirectPage() {
    const searchParams = useSearchParams()

    useEffect(() => {
        const error = searchParams.get('error')
        const code = searchParams.get('code')
        if (error || !code) {
            const queryParamString = new URLSearchParams({
                error: error ?? "no_code",
            }).toString();

            redirect(`/spotify?${queryParamString}`, RedirectType.replace);
        }

        getToken(code)
            .then(console.log)
    }, [])

    return (
        <div className="flex items-center w-full h-full justify-center">
            <h1></h1>
            <FaSpotify size={20} />
        </div>
    );
}
