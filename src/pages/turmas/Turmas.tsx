import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';
import { LoadContext } from '../../contexts/LoadContext';

import { UTANGA_API } from '../../settings';
import axios from 'axios';

import './turmas.scss';

type TurmasResponse = { // A API retorna mais informações, mas no momento só preciso dos Ids 
    id: string;
}

export default function Turmas() {
    const navigate = useNavigate();

    const { onLogout, setIdTurmaDestino } = useContext(AuthContext)!;
    const { setIsLoading } = useContext(LoadContext);

    const [turmas, setTurmas] = useState<string[]>([]);

    const onSelect = (id: string) => {
        setIdTurmaDestino(id);
        navigate('/login')
    }

    const TURMAS_FIXAS = ['EIMK_livre', 'EIMK_total', 'EIMK_parcial', 'EIMK_pontual']

    const buscarTurmas = async () => {
        setIsLoading?.(true);
        try {
            const res = await axios.get<TurmasResponse[]>(`${UTANGA_API}turma`);

            const idsNaoFixos = res.data
                .filter(({ id }) => !TURMAS_FIXAS.includes(id))
                .map(({ id }) => id);

            setTurmas([...TURMAS_FIXAS, ...idsNaoFixos]);
        } catch (error) {
            console.log(`Erro listas turmas: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    useEffect(() => {
        onLogout()
        buscarTurmas();
    }, []);

    return (
        <div className="main-container">
            <h1 className='text-title'>Entre em uma turma</h1>

            <div className="turmas-container">
                {turmas.map((turma) => (
                    <button className="btn-turma" key={turma} onClick={() => { onSelect(turma) }}>
                        <p className="text">Turma: <span>{turma}</span></p>
                    </button>
                ))}
            </div>
        </div>
    )
}