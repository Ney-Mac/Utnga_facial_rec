import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { LoadContext } from '../../contexts/LoadContext';
import { UTANGA_API } from '../../settings';
import axios from 'axios';
import './faltas.scss';

type ResponseType = {
    id: number,
    estudante: string,
    cadeira: string,
    turma: string,
    horario_aula: {
        hora_inicio: string,
        hora_fim: string,
        dia_semana: string
    }
}

export default function Faltas() {
    const { } = useContext(AuthContext)!;
    const { setIsLoading } = useContext(LoadContext);

    const [faltas, setFaltas] = useState<ResponseType[]>([]);

    const buscarFaltas = async () => {
        setIsLoading?.(true);
        try {
            const res = await axios.get<ResponseType[]>(`${UTANGA_API}faltas`);
            console.log(res.data);

            setFaltas(res.data)
        } catch (error) {
            console.log(`Erro ao listar faltas: ${error}`);
        } finally {
            setIsLoading?.(false);
        }
    }

    useEffect(() => {
        buscarFaltas();
    }, []);

    return (
        <main className="faltas-container">
            <h1 className="title">Lista de faltas lançadas</h1>

            <div className="faltas-list">
                {faltas.map(({ id, estudante, cadeira, turma, horario_aula }) => (
                    <div className="falta-container" key={id}>
                        <p className="text">{id}</p>
                        <p className="text">{estudante}</p>
                        <p className="text">{cadeira}</p>
                        <p className="text">{turma}</p>
                        <p className="text">{horario_aula.dia_semana}</p>
                        <p className="text">{horario_aula.hora_inicio}</p>
                        <p className="text">{horario_aula.hora_fim}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}