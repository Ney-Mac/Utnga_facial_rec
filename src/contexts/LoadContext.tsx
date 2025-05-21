import { createContext, useState } from "react";

type Props = {
    isLoading: Boolean;
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

type ProvideProps = {
    children: React.ReactNode;
}

export const LoadContext = createContext<Props>({ isLoading: false });

export const LoadContextProvider = ({ children }: ProvideProps) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadContext.Provider
            value={{
                isLoading,
                setIsLoading
            }}
        >{children}</LoadContext.Provider>
    )
}