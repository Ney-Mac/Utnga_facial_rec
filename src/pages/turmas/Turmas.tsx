import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadContext } from '../../contexts/LoadContext';
import { AuthContext } from '../../contexts/AuthContext';
import { UTANGA_API } from '../../settings';
import axios from 'axios';
import './turmas.scss';

type TurmaType = {
    id: string;
}

export default function Turmas() {
    const { setIsLoading } = useContext(LoadContext);
    const { setSelectedTurma } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const [turmas, setTurmas] = useState<TurmaType[]>([]);

    const onSelect = (id: string) => {
        setSelectedTurma(id);
        navigate('/login');
    }

    const fetchTurmas = async () => {
        try {
            setIsLoading?.(true)
            const res = await axios.get<TurmaType[]>(`${UTANGA_API}turma/`);
            setTurmas(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(`Erro ao listar turmas: ${error}`)
        } finally {
            setIsLoading?.(false)
        }
    }

    useEffect(() => {
        fetchTurmas();
    }, []);

    return (
        <div className="turmas-list-container">
            <h3 className="text-title">Selecione uma turma para entrar</h3>
            
            <div className="turmas-container">
                {turmas?.map((turma, index) => (
                    <button className='btn-turma' key={index} onClick={() => { onSelect(turma.id) }}>
                        <p className='text'>Turma: <span>{turma.id}</span></p>
                    </button>
                ))}
            </div>
        </div>
    )
}