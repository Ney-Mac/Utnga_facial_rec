import { createContext, useState } from "react";
import axios from "axios";

type Props = {
    onFirstLoad: () => void;
    user: UserType;
    login: (image: string) => void;
}

type ProviderProps = {
    children: React.ReactNode;
}

// type UserType = null | {
//     type: 'studant' | 'teacher' | 'adm';
//     id: number;
// }

type UserType = null | {
    id: number;
    nome: string;
    tipo: 'admin' | 'aluno' | 'professor';
    codigoAcesso: string;
    curso: string | null;
    departamento: string | null;
    nivel: string | null;
}

export const AuthContext = createContext<Props | null>(null);

export const AuthContextProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<UserType>(null);

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

        try {
            const response = await axios.post('http://localhost:8000/login/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log(response.data.message);
            setUser(response.data.user);

            localStorage.setItem('user', response.data.user)
        } catch (error) {
            console.log('Erro ao fazer login: ', error);
        }
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