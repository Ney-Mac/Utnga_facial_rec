import { useEffect, useState, useContext } from 'react';
import {
    SearchBar,
    Button,
    Table,
    ModalAddAluno,
} from '../../components';
import './alunos.scss';

import axios from 'axios';
import { API_URL, UTANGA_API } from '../../settings';
import { UserType } from '../../utils/UserType';
import { LoadContext } from '../../contexts/LoadContext';

import { TurmaType } from '../../utils/TurmaType';

export default function AlunosAdmin() {
    const { setIsLoading } = useContext(LoadContext);
    const [alunos, setAlunos] = useState<UserType[]>([]);
    const [keys, setKeys] = useState<string[]>([]);
    const [idAluno, setIdAluno] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);

    const [search, setSearch] = useState({ value: '', error: '' });

    const fetchTurmas = async () => {
        try {
            setIsLoading?.(true);
            const res = await axios.get<TurmaType[]>(`${UTANGA_API}turma/`);
            console.log(res.data);

        } catch (error) {
            console.log(`Erro ao buscar turmas: ${error}`)
        } finally {
            setIsLoading?.(false);
        }
    }

    const fetchAlunos = async () => {

        try {
            setIsLoading?.(true);
            const res = await axios.get<UserType[]>(`${API_URL}usuario/`, {
                params: {
                    tipo: 'estudante'
                }
            });

            // console.log(res.data)
            const _keys = [...Object.keys(res.data[0]), 'Adicionar dados']
            setKeys(_keys)
            setAlunos(res.data);
        } catch (error) {
            console.log(`Erro ao buscar alunos: ${error}`)
        } finally {
            setIsLoading?.(false);
        }
    }

    const onAddClick = (id: number) => {
        console.log(id)
        setIdAluno(id);
        setShowModal(!showModal);
    }

    useEffect(() => {
        if (!showModal) {
            fetchAlunos();
            fetchTurmas();
        }
    }, [showModal]);

    return (
        <main className="alunos-admin">
            <ModalAddAluno
                idAluno={idAluno!}
                show={showModal}
                setShow={setShowModal}
                idLabel="Aluno"
            />

            <div className="head-bar">
                <SearchBar
                    onSearch={() => { }}
                    placeholder='Pesquisar aluno por id'
                    errorText={search.error}
                    value={search.value}
                    changeValue={(value) => { setSearch({ value: value, error: '' }) }}
                />
            </div>

            {alunos.length ?
                <div className="studant-table">
                    <Table
                        useGrid
                        header={keys}
                        body={alunos}
                        renderRow={(item) => <>
                            {Object.values(item).map((itemValue, index) => (
                                <p className="item" key={index}>{itemValue}</p>
                            ))}
                            {item["dados faciais"] === 'nao' ?
                                <Button
                                    text='Add'
                                    type='contained'
                                    onClick={() => { onAddClick(item.id) }}
                                /> : <p>-</p>}
                        </>}
                    />
                </div>
                : <p className="err">Nenhum aluno encontrado.</p>
            }
        </main>
    )
}