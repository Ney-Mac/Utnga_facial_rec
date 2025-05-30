import { useContext, useState, useEffect } from 'react';

import { TopMenu } from '../../components/top_menu/TopMenu';
import { NotificationRow, SearchBar } from '../../components';

import { LoadContext } from '../../contexts/LoadContext';
import { AuthContext } from '../../contexts/AuthContext';

import { API_URL, UTANGA_API } from '../../settings';
import axios from 'axios';

import { TurmaType } from '../../utils/TurmaType';
import { UserType } from '../../utils/UserType';

import { Table } from '../../components/';

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

    const [alunos, setAlunos] = useState<UserType[]>([]);

    const TIME_TO_FETCH_IN_SECONDS = 1000 * 60 * 1

    const responder = async (id_solicitacao: number, aceitar: boolean) => {
        setIsLoading?.(true);
        try {
            const res = await axios.post(`${API_URL}acesso-especial/responder`, null, {
                params: { id_solicitacao, aceitar }
            });

            await fetchSolicitacoes();
            console.log(res.data);
        } catch (error) {
            console.log(`Erro ao ${aceitar ? 'permitir' : 'rejeitar'} acesso especial: ${error}`);
            setIsLoading?.(false);
        }
    }

    const fetchSolicitacoes = async () => {
        setIsLoading?.(true);
        try {
            const res = await axios.get<Response[]>(`${API_URL}acesso-especial/listar`, {
                params: {
                    id_turma: idTurmaDestino
                }
            });

            console.log(res.data.filter((solicitacao) => solicitacao.situacao === "PENDENTE"));
            setSolicitacoes(res.data.filter((solicitacao) => solicitacao.situacao === "PENDENTE"));

        } catch (error: any) {
            console.log(`Erro ao listar solicitacoes de acesso especial: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    const buscarAlunosTurma = async () => {
        setIsLoading?.(true);
        try {
            const res = await axios.get<TurmaType[]>(`${UTANGA_API}turma/`, {
                params: {
                    id: idTurmaDestino
                }
            });
            const estudantes: UserType[] = [];

            res.data.forEach(({ cadeiras }) => {
                cadeiras.forEach(({ estudantes: estudantesCadeira }) => {
                    estudantesCadeira.forEach((estudante) => {
                        const jaExiste = estudantes.some(e => e.id === estudante.id);

                        if (!jaExiste) {
                            estudantes.push(estudante);
                        }
                    });
                });
            });

            setAlunos(estudantes);

        } catch (error) {
            console.log(`Erro ao buscar alunos: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    useEffect(() => {
        fetchSolicitacoes(); // Carrega as solicitacoes a primeira vez
        buscarAlunosTurma();

        const intervalId = setInterval(() => { // Recarrega as solicitacoes a cada TIME_TO_FETCH_IN_SECONDS
            fetchSolicitacoes();
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


                <div className="requirements-container">
                    <h2 className="title">{solicitacoes.length === 0 ? 'Sem p' : 'P'}edidios de acesso</h2>

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


                <div className="presents-container">
                    <h2 className="title">{solicitacoes.length ? 'Alunos Presentes (A turma está em aulas)' : 'A turma não está em aulas'}</h2>

                    {alunos.map(({ id, nome }) => (
                        <div className='aluno-row' key={id}>
                            <p className="aluno">{nome} - {id}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}