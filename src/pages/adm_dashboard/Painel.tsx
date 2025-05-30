import { useState, useContext, useEffect } from 'react';
import { LoadContext } from '../../contexts/LoadContext';
import { AuthContext } from '../../contexts/AuthContext';

import { Table, SearchBar } from '../../components';

import axios from 'axios';
import { API_URL } from '../../settings';

// import Logo from '../../assets/images/logo/logo_utanga.png';
import './painel.scss';


type Response = {
    nome_estudante: string;
    n_matricula: string;
    turma: string;
    hora_entrada: string;   // Ex: "07:00:00"
    data_entrada: string;   // Ex: "2025-05-28"
    estado: string;         // Tipo de acesso, como "entrada", "saida", etc.
}

type ResponseTurma = {
    id_turma: string;
    acessos: {
        nome_estudante: string;
        n_matricula: string;
        hora_entrada: string;
        data_entrada: string;
        estado: string;
        cadeira: string;
    }[];
}

export default function Painel() {
    const { } = useContext(AuthContext)!;
    const { setIsLoading } = useContext(LoadContext);

    const [logs, setLogs] = useState<Response[]>([]);
    const [keys, setKeys] = useState<string[]>([]);
    const [logsTurma, setLogsTurma] = useState<ResponseTurma>();

    const [search, setSearch] = useState({ value: '', error: '' });


    const fethLogs = async () => {
        try {
            setIsLoading?.(true);

            const res = await axios.get<Response[]>(`${API_URL}controle-acesso/`);

            setLogs(res.data.reverse())
            setKeys([
                'Nome',
                'Nº Matrícula',
                'Turma',
                'Hora de Entrada',
                'Data de Entrada',
                'Estado'
            ])
        } catch (err) {
            console.log(`Erro fetch logs: ${err}`)
        } finally {
            setIsLoading?.(false);
        }
    }

    const getDate = (): string => {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }

    const getDayWeek = () => {
        return ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"][new Date().getDay()];
    }

    useEffect(() => {
        fethLogs();
    }, []);

    const onSearch = () => {
        const searchError = search.value == '' ? "*Campo obrigatório" : '';
        if (searchError) {
            setSearch({ ...search, error: searchError });
            return
        }
        fetchLogsTurma()
    }

    const fetchLogsTurma = async () => {

        // setSearch({ value: '', error: '' })
        // try {
        //     setIsLoading?.(true);

        //     const res = await axios.get<ResponseTurma>(`${API_URL}controle-acesso/acessos-turma/${search.value}`);

        //     setKeys([
        //         'Nome',
        //         'Nº Matrícula',
        //         'Hora de Entrada',
        //         'Data de Entrada',
        //         'Estado',
        //         'Cadeira'
        //     ])
        //     console.log(res.data)
        //     setLogsTurma(res.data)
        // } catch (err: any) {
        //     console.log(`Erro fetch logs turmas: ${err}`);
        //     if (err.status === 404) {
        //         setSearch({ ...search, error: `Acesos não encontrados.` })
        //     }
        // } finally {
        //     setIsLoading?.(false);
        // }
    }

    return (
        <main className="painel-main">

            <h1 className="title">Relatório de Acessos gerais</h1>

            <div className="data-container">
                <p className="data">Data: <span>{getDate()}, {getDayWeek()}</span></p>
            </div>

            <div className="container-search">
                <SearchBar
                    value={search.value}
                    placeholder='Pesquisar turma'
                    label=''
                    onSearch={onSearch}
                    errorText={search.error}
                    changeValue={(value) => { setSearch({ value: value, error: '' }) }}
                />
            </div>

            {logs.length || logsTurma ?
                <>
                    <div className="ultimos-acessos">
                        <h3 className="last-title">
                            {logsTurma ? `Aessos (Turma ${logsTurma.id_turma})` : 'Últimos acessos e tentativas'}
                        </h3>
                        <Table
                            header={keys}
                            body={logs}
                            renderRow={(item) => <>
                                {Object.values(item).map((itemValue, index) => (
                                    <p className="item" key={index}>{itemValue}</p>
                                ))}
                            </>}
                        />
                    </div>
                </>
                : <div className="no-content">
                    <h3 className="error-text">Nenhum acesso</h3>
                </div>
            }
        </main>
    )
}
