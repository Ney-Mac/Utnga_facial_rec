import { createContext, useState, useContext, useEffect } from "react";
import { LoadContext } from "./LoadContext";

import { API_URL, UTANGA_API } from "../settings";
import axios from "axios";

import { UserType } from "../utils/UserType";
import { TurmaType } from "../utils/TurmaType";
import { CadeiraType } from "../utils/CadeiraType";

type Props = {
    onFirstLoad: () => void;
    onLogout: () => void;
    login: (image: string) => void;

    message: string;
    acessoEspecialDisponivel: string | undefined; 

    idTurmaDestino: string;
    setIdTurmaDestino: React.Dispatch<React.SetStateAction<string>>;

    user: UserType | null;
    responseError: string | null;
    setResponseError: React.Dispatch<React.SetStateAction<string | null>>;

    loginAdmProf: (numFunc: string, password: string) => void;
}

type ProviderProps = {
    children: React.ReactNode;
}

type LoginResponse = {
    message: string;
    user: UserType;
    turma_destino?: TurmaType[];
    cadeira_em_aula?: CadeiraType;
    acesso_especial_disponivel?: string;
}

export const AuthContext = createContext<Props | null>(null);

export const AuthContextProvider = ({ children }: ProviderProps) => {
    const { setIsLoading } = useContext(LoadContext);

    const [user, setUser] = useState<UserType | null>(null);
    const [responseError, setResponseError] = useState<string | null>(null);

    const [idTurmaDestino, setIdTurmaDestino] = useState("");

    const [acessoEspecialDisponivel, setAcessoEspecialDisponivel] = useState<string | undefined>();
    const [message, setMessage] = useState('');

    const loginAdmProf = async (numFunc: string, password: string) => {
        setIsLoading?.(true);
        if (password !== '12345') {
            setResponseError("Senha errada. Tente novamnet.");
            setIsLoading?.(false);
            return;
        }

        try {
            const response = await axios.get(`${UTANGA_API}usuario/`, { params: { id: numFunc } });

            console.log(response.data[0]);
            setUser(response.data[0]);
            localStorage.setItem('user', JSON.stringify(response.data[0]))

        } catch (error) {
            console.log(`Erro ao logar adm ou prof: ${error}`);
            /*@ts-ignore*/
            setResponseError(error)
        } finally {
            setIsLoading?.(false);
        }
    }

    const onFirstLoad = () => {
        try {
            setIsLoading?.(true);
            const res = localStorage.getItem('user');

            if (res) {
                const usuario = JSON.parse(res) as UserType
                setUser(usuario);
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
        formData.append('id_turma_destino', idTurmaDestino)

        try {
            setIsLoading?.(true);
            const response = await axios.post<LoginResponse>(`${API_URL}usuario/logar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log(response.data)

            localStorage.setItem('user', JSON.stringify(response.data.user))
            setUser(response.data.user);

            setMessage(response.data.message);
            setAcessoEspecialDisponivel(response.data.acesso_especial_disponivel)

        } catch (error: any) {
            console.log('Erro ao fazer login: ', error.response.data.message);
            setResponseError(error.response.data.message)
        } finally {
            setIsLoading?.(false);
        }
    }

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

    useEffect(() => {
        setResponseError(null)
        if (!user) onFirstLoad()
        // onLogout()
    }, []);

    return (
        <AuthContext.Provider
            value={{
                acessoEspecialDisponivel,
                message,
                user,
                responseError,
                idTurmaDestino,
                login,
                onLogout,
                onFirstLoad,
                loginAdmProf,
                setResponseError,
                setIdTurmaDestino,
            }}
        >{children}</AuthContext.Provider>
    )
}