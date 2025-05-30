import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { TopMenu } from '../../components/top_menu/TopMenu';
import { Button } from '../../components';
import { LoadContext } from '../../contexts/LoadContext';
import axios from 'axios';
import './welcomePage.scss';
import { API_URL } from '../../settings';

type RespostaSolicitacao = "Nenhuma" | "Pendente" | "Aceite" | "Negado"

export default function WelcomePage() {
    const {
        user,
        acessoEspecialDisponivel,
        message,
        idTurmaDestino,
        setAcessoEspecialDisponivel,
        setMessage,
    } = useContext(AuthContext)!;
    const { setIsLoading } = useContext(LoadContext);
    const [count, setCount] = useState(59)
    const [startCount, setStartCount] = useState(false)
    const [respostaSolicitacao, setRespostaSolicitacao] = useState<RespostaSolicitacao>('Nenhuma');

    useEffect(() => {
        if (startCount) {
            setTimeout(() => {
                if (count > 0) {
                    setCount(count - 1)
                } else {
                    setStartCount(false);
                    //Consultar solicitacao
                }
            }, 1000);
        }
    }, [count, startCount]);

    const solicitarAcesso = async () => {
        setIsLoading?.(true);
        try {
            const response = await axios.post(`${API_URL}acesso-especial/solicitar`, null, {
                params: {
                    id_usuario: user?.id,
                    id_turma_destino: idTurmaDestino
                }
            });

            console.log(response.data);
            setRespostaSolicitacao('Pendente');
            setStartCount(true);

        } catch (error) {
            console.log(`Erro ao logar adm ou prof: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    };

    const consultarSolicitacao = async () => {
        // setIsLoading?.(true);
        try {
            const response = await axios.get(`${API_URL}acesso-especial/consultar`, {
                params: {
                    id_usuario: user?.id,
                    id_turma_destino: idTurmaDestino
                }
            });

            console.log(response.data);
            if (response.data.status_solicitacao) {
                if (response.data.status_solicitacao === 'PENDENTE') {
                    setRespostaSolicitacao('Pendente');
                    setTimeout(() => {
                        return consultarSolicitacao();
                    }, 1000 * 60 * 5);
                } else if (response.data.status_solicitacao === 'REJEITADO') {
                    setRespostaSolicitacao('Negado');
                } else {
                    setRespostaSolicitacao('Aceite');
                    setMessage('Seu pedido foi aceite. Acesso concedido. Tenha um excelente aproveitamento.');
                    setAcessoEspecialDisponivel(undefined)
                }
            } else {
                setRespostaSolicitacao('Nenhuma')
            }

        } catch (error) {
            console.log(`Erro ao logar adm ou prof: ${error}`);
        } 
        // finally {
        //     setIsLoading?.(false);
        // }
    }

    useEffect(() => {
        consultarSolicitacao();
    }, []);

    return (
        <main className="welcome-page">
            <TopMenu />

            <div className="container">
                <div className="authorized-student">
                    <h1 className='text-title'>Estudante <span>{user?.nome}</span></h1>
                    <p className={`${acessoEspecialDisponivel ? 'error-text' : 'success-text'}`}>{message}</p>
                    {user?.curso && <p className="text-item">Aluno do Curso: <span>{user?.curso}</span></p>}
                    {user?.ano_lectivo && <p className="text-item">Ano lectivo: <span>{user?.ano_lectivo}</span></p>}

                    {acessoEspecialDisponivel === 'sim' && <div className="btn-container">
                        {respostaSolicitacao === 'Nenhuma' ?
                            <Button text='Solicitar acesso especial' onClick={solicitarAcesso} />
                            : respostaSolicitacao === 'Pendente' ?
                                <p>Já fez a solicitação especial, aguarde a resposta...</p>
                                : respostaSolicitacao === 'Aceite' ?
                                    <p>Solicitação aceite</p>
                                    : <p>Solicitação negada</p>
                        }
                    </div>}
                </div>
            </div>
        </main>
    )
}