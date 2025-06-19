//@ts-check
import { useState } from "react";
import { getLoginInfo } from "./api.js";
import { createContext, useContext, useCallback } from "react";

const LoginContext = createContext(/** @type {[import("./api.js").LoginInfo | null, () => void]} */ ([null, () => {}]))

export function LoginProvider({ children }) {
    const [info, setInfo] = useState(getLoginInfo())

    const refresh = useCallback(() => {
        setInfo(getLoginInfo())
    }, [])

    return (
        <LoginContext.Provider value={[info, refresh]}>
            {children}
        </LoginContext.Provider>
    )
}

export const useLoginInfo = () => useContext(LoginContext)