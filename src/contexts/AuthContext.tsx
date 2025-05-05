import { createContext, useState } from "react";
// import axios from "axios";

type Props = {
    onFirstLoad: () => void;
    user: UserType;
    login: () => void;
}

type ProviderProps = {
    children: React.ReactNode;
}

type UserType = null | {
    type: 'studant' | 'teacher' | 'adm';
    id: number;
}

export const AuthContext = createContext<Props | null>(null);

export const AuthContextProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<UserType>({ type: 'adm', id: 123 });

    const onFirstLoad = () => {
        try {
            const res = localStorage.getItem('user') as UserType;

            if (res) {
                setUser(res);
            }
        } catch (error) {
            console.log(`onFirstLog Error: ${error}`);
        }
    }

    const login = async () => {

    }

    return (
        <AuthContext.Provider
            value={{
                onFirstLoad,
                user,
                login
            }}
        >{children}</AuthContext.Provider>
    )
}