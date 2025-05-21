import { useState, useContext, useEffect } from 'react';
import {
    Button,
    SearchBar,
    Table,
} from '../../components'
import './profs.scss';
import { LoadContext } from '../../contexts/LoadContext';
import { API_URL } from '../../settings';
import axios from 'axios';
import { UserType } from '../../utils/UserType';

export default function ProfsAdmin() {
    const { setIsLoading } = useContext(LoadContext);

    const [keys, setKeys] = useState<string[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);

    const fetchUsers = async () => {
        try {
            setIsLoading?.(true);
            const res_adm = await axios.get<UserType[]>(`${API_URL}usuario/`, {
                params: {
                    tipo: 'adm'
                }
            });

            const res_prof = await axios.get<UserType[]>(`${API_URL}usuario/`, {
                params: {
                    tipo: 'prof'
                }
            });

            console.log([...res_adm.data, ...res_prof.data])

            setKeys(Object.keys(res_adm.data[0]))
            setUsers([...res_adm.data, ...res_prof.data]);
        } catch (error) {
            console.log(`Erro ao buscar usuarios: ${error}`)
        } finally {
            setIsLoading?.(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);


    return (
        <main className="profs-admin">
            <div className="head-bar">
                <SearchBar
                    onSearch={() => { }}
                    placeholder='Nome, número funcionário'
                />

                <div className="head-btn-container">
                    <Button
                        text='Adicionar professor'
                        type='contained'
                        onClick={() => { }}
                    />

                    <Button
                        text='Adicionar administrador'
                        type='outlined'
                        onClick={() => { }}
                    />
                </div>
            </div>

            {users.length ?
                <div className="studant-table">
                    <Table
                        header={keys}
                        body={users}
                        renderRow={(item) => <>
                            {Object.values(item).map((itemValue, index) => (
                                <p className="item" key={index}>{itemValue}</p>
                            ))}
                        </>}
                    />
                </div>
                : <p className="err">Nenhum usuario encontrado.</p>
            }
        </main>
    )
}