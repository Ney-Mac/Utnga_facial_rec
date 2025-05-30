import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { TopMenu } from '../../components/top_menu/TopMenu';
import { Button } from '../../components';
import { LoadContext } from '../../contexts/LoadContext';
import axios from 'axios';
import './welcomePage.scss';
import { API_URL } from '../../settings';

export default function WelcomePage() {
    const { user, acessoEspecialDisponivel, message, idTurmaDestino } = useContext(AuthContext)!;
    const { setIsLoading } = useContext(LoadContext);
    const [count, setCount] = useState(59)
    const [startCount, setStartCount] = useState(false)

    useEffect(() => {
        console.log(count)
        if (startCount) {
            setTimeout(() => {
                if (count > 0) {
                    setCount(count - 1)
                } else {
                    setStartCount(false)
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
            setStartCount(true);

        } catch (error) {
            console.log(`Erro ao logar adm ou prof: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    };


    return (
        <main className="welcome-page">
            <TopMenu />

            <div className="container">
                <div className="authorized-student">
                    <h1 className='text-title'>Estudante <span>{user?.nome}</span></h1>
                    <p className={`${message} ${acessoEspecialDisponivel ? 'error-text' : 'success-text'}`}>{message}</p>
                    {user?.curso && <p className="text-item">Aluno do Curso: <span>{user?.curso}</span></p>}
                    {user?.ano_lectivo && <p className="text-item">Ano lectivo: <span>{user?.ano_lectivo}</span></p>}

                    {acessoEspecialDisponivel === 'sim' && <div className="btn-container">
                        {startCount ?
                            <p>Esperar: {count} s</p>
                            : <Button text='Solicitar acesso especial' onClick={solicitarAcesso} />
                        }
                    </div>}
                </div>
            </div>
        </main>
    )
}