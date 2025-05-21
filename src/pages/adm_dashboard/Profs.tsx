import {
    Button,
    SearchBar,
    Table,
} from '../../components'
import './profs.scss';

const header = ['Id', 'Nome', 'Número de funcionário', 'Tipo', 'Nivel/Departamento'];

const body = [
    { id: 1, nome: "Mestre", codigoAcesso: 'mestre1', tipo: 'adm', nivel: 'mestre' },
    { id: 2, nome: "Prof", codigoAcesso: 'prof1', tipo: 'prof', departamento: 'Engenharias' },
    { id: 4, nome: "Master", codigoAcesso: 'master1', tipo: 'adm', nivel: 'base' },
    { id: 7, nome: "Teacher", codigoAcesso: 'teacher1', tipo: 'prof', nivel: 'Sociais' },
]

export default function ProfsAdmin() {
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

            <div className="studant-table">
                <Table
                    header={header}
                    body={body}
                    renderRow={(item) => <>
                        {Object.values(item).map((itemValue) => (
                            <p className="item">{itemValue}</p>
                        ))}
                    </>}
                />
            </div>
        </main>
    )
}