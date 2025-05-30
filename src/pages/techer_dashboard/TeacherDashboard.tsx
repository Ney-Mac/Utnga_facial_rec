import { useContext, useState, useEffect } from 'react';

import { TopMenu } from '../../components/top_menu/TopMenu';
import { NotificationRow, SearchBar } from '../../components';

import { LoadContext } from '../../contexts/LoadContext';
import { AuthContext } from '../../contexts/AuthContext';

import { API_URL } from '../../settings';
import axios from 'axios';

import './teacherDashboard.scss';

type Response = {
    id: number;
    situacao: string;
    data_hora_pedido: string;
    id_turma: string;
    id_cadeira: string;
    estudante: {
        id: string | number;
        nome: string;
    };
}

export default function TeacherDashboard() {
    const { setIsLoading } = useContext(LoadContext);
    const { user, idTurmaDestino } = useContext(AuthContext)!;

    const [search, setSearch] = useState({ value: '', error: '' });
    const [solicitacoes, setSolicitacoes] = useState<Response[]>([]);

    const TIME_TO_FETCH_IN_SECONDS = 1000 * 10

    const responder = async (id_solicitacao: number, aceitar: boolean) => {
        setIsLoading?.(true);
        try {
            const res = await axios.post(`${API_URL}acesso-especial/responder`, null, {
                params: { id_solicitacao, aceitar }
            });

            await fetchSolicitacoes(false);

            console.log(res.data);
        } catch (error) {
            console.log(`Erro ao ${aceitar ? 'permitir' : 'rejeitar'} acesso especial: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    const fetchSolicitacoes = async (isRefresh: boolean) => {
        if (!isRefresh) setIsLoading?.(true);

        try {
            const res = await axios.get<Response[]>(`${API_URL}acesso-especial/listar`, {
                params: {
                    id_turma: idTurmaDestino
                }
            });

            console.log(res.data);
            setSolicitacoes(res.data);

        } catch (error: any) {
            console.log(`Erro ao listar solicitacoes de acesso especial: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    useEffect(() => {
        fetchSolicitacoes(false); // Carrega as solicitacoes a primeira vez

        const intervalId = setInterval(() => { // Recarrega as solicitacoes a cada TIME_TO_FETCH_IN_SECONDS
            fetchSolicitacoes(true);
        }, TIME_TO_FETCH_IN_SECONDS);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <main className="teacher-dashboard-container">
            <TopMenu />

            <div className="container">
                <div className="prof-data">
                    <h2 className="prof-name">Prof: {user?.nome}</h2>
                    <p className="turma-name"></p>
                </div>

                {solicitacoes.length > 0 ? <>
                    <div className="requirements-container">
                        <h2 className="title">Pedidios de acesso:</h2>

                        {solicitacoes.map(({ id, estudante }, index) => (
                            <NotificationRow
                                key={index}
                                studantName={estudante.nome}
                                cause="Atraso"
                                onPermit={() => { responder(id, true) }}
                                onReject={() => { responder(id, false) }}
                            />
                        ))}
                    </div>
                    <div className="search-container">
                        <SearchBar
                            errorText={search.error}
                            value={search.value}
                            changeValue={(value) => { setSearch({ value, error: '' }) }}
                            placeholder='Pesquisar aluno'
                            onSearch={() => { }}
                        />
                    </div>

                </>
                    : <div><h2 className="title">Nenhuma solicitação</h2></div>
                }

                <div className="presents-container">
                    <h2 className="title">{solicitacoes ? 'Alunos Presentes (A turma está em aulas)' : 'Horário da turma (A turma não está em aulas)'}</h2>


                </div>
            </div>
        </main>
    )
}