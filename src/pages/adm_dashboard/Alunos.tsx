import { useEffect, useState, useContext } from 'react';
import {
    SearchBar,
    Button,
    Table,
    ModalAddAluno,
} from '../../components';
import './alunos.scss';

import axios from 'axios';
import { API_URL } from '../../settings';
import { UserType } from '../../utils/UserType';
import { LoadContext } from '../../contexts/LoadContext';

export default function AlunosAdmin() {
    const { setIsLoading } = useContext(LoadContext);
    const [alunos, setAlunos] = useState<UserType[]>([]);
    const [keys, setKeys] = useState<string[]>([]);

    const [showModal, setShowModal] = useState(false);

    const fetchAlunos = async () => {
        try {
            setIsLoading?.(true);
            const res = await axios.get<UserType[]>(`${API_URL}usuario/`, {
                params: {
                    tipo: 'aluno'
                }
            });

            setKeys(Object.keys(res.data[0]))
            setAlunos(res.data);
        } catch (error) {
            console.log(`Erro ao buscar alunos: ${error}`)
        } finally {
            setIsLoading?.(false);
        }
    }

    useEffect(() => {
        if (!showModal) {
            fetchAlunos();
        }
    }, [showModal]);

    return (
        <main className="alunos-admin">
            <ModalAddAluno
                show={showModal}
                setShow={setShowModal}
            />

            <div className="head-bar">
                <SearchBar
                    onSearch={() => {}}
                    placeholder='Pesquisar aluno por id'
                />
                <Button
                    text='Adicionar aluno'
                    type='contained'
                    onClick={() => { setShowModal(!showModal) }}
                />
            </div>

            {alunos.length ?
                <div className="studant-table">
                    <Table
                        header={keys}
                        body={alunos}
                        renderRow={(item) => <>
                            {Object.values(item).map((itemValue, index) => (
                                <p className="item" key={index}>{itemValue}</p>
                            ))}
                        </>}
                    />
                </div>
                : <p className="err">Nenhum aluno encontrado.</p>
            }
        </main>
    )
}