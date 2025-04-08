"use client";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import type { User } from "@/types/user";

interface UserContextType {
    user: User | undefined;
    setUser: (user: User | undefined) => void;
}

interface Props {
    children: ReactNode,
    initUser: User
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children, initUser }: Props) => {
    const [user, setUser] = useState<User | undefined>(initUser);

    const userContextValue = useMemo(() => ({ user, setUser }), [user]);

    return (
        <UserContext.Provider value={userContextValue}>
            {children}
        </UserContext.Provider>
    );
}

const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

export { UserProvider, useUser };