import { createContext, useState, useContext, useEffect } from "react";
import { LoadContext } from "./LoadContext";
import axios from "axios";
import { UserType } from "../utils/UserType";

import { API_URL } from "../settings";

type Props = {
    onFirstLoad: () => void;
    onLogout: () => void; 
    user: UserType | null;
    login: (image: string) => void;
    responseError: string | null;
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>;
    selectedTurma: string;
    setSelectedTurma: React.Dispatch<React.SetStateAction<string>>;
}

type ProviderProps = {
    children: React.ReactNode;
}

type LoginResponse = {
    message: string;
    user: UserType;
}

export const AuthContext = createContext<Props | null>(null);

export const AuthContextProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [responseError, setResponseError] = useState<string | null>(null);
    const { setIsLoading } = useContext(LoadContext);

    const [selectedTurma, setSelectedTurma] = useState('');

    useEffect(() => { setResponseError(null) }, [])

    useEffect(() => {
        if(!user) onFirstLoad()
    }, []);

    const onLogout = () => {
        try {
            setIsLoading?.(true);
            localStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.log(`onLogout Error: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    const onFirstLoad = () => {
        try {
            setIsLoading?.(true);
            const res = localStorage.getItem('user');

            if (res) {
                setUser(JSON.parse(res) as UserType);
            }
        } catch (error) {
            console.log(`onFirstLog Error: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    const login = async (imageUrl: string) => {
        const byteString = atob(imageUrl.split(',')[1]);
        const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], "capture.jpeg", { type: mimeString });

        const formData = new FormData();
        formData.append('image', file);
        formData.append('id_turma_destino', selectedTurma)

        try {
            setIsLoading?.(true);
            const response = await axios.post<LoginResponse>(`${API_URL}usuario/logar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log(response.data.user)

            localStorage.setItem('user', JSON.stringify(response.data.user))
            setUser(response.data.user);

        } catch (error: any) {
            console.log('Erro ao fazer login: ', error.response.data.message);
            setResponseError(error.response.data.message)
        } finally {
            setIsLoading?.(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                responseError,
                login,
                onLogout,
                onFirstLoad,
                setResponseError,
                selectedTurma,
                setSelectedTurma
            }}
        >{children}</AuthContext.Provider>
    )
}