import { createContext, useState, useContext, useEffect } from "react";
import { LoadContext } from "./LoadContext";
import axios from "axios";
import { UserType } from "../utils/UserType";

type Props = {
    onFirstLoad: () => void;
    onLogout: () => void; 
    user: UserType | null;
    login: (image: string) => void;
    responseError: string | null;
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>;
}

type ProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext<Props | null>(null);

export const AuthContextProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [responseError, setResponseError] = useState<string | null>(null);
    const { setIsLoading } = useContext(LoadContext);

    useEffect(() => { setResponseError(null) }, [])

    useEffect(() => {
        onFirstLoad()
        // onLogout()
    }, []);

    const onLogout = () => {
        try {
            localStorage.removeItem('user');
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
        // formData.append('id_turma', '1')

        try {
            setIsLoading?.(true);
            const response = await axios.post('http://localhost:8000/usuario/logar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            localStorage.setItem('user', JSON.stringify(response.data.user))

            console.log(response.data);
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
                setResponseError
            }}
        >{children}</AuthContext.Provider>
    )
}