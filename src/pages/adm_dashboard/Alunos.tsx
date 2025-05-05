import {
    SearchBar,
    Button,
    Table,
} from '../../components';
import './alunos.scss';

const alunos_header = ['Id', 'Nome', 'Número de matrícula', 'Curso'];

const alunos = [
    { id: 1, nome: "Manuel", codigoAcesso: "20200730", curso: "Informatica" },
    { id: 2, nome: "Armando", codigoAcesso: "20200730", curso: "Informatica" },
    { id: 3, nome: "Cariongo", codigoAcesso: "20200730", curso: "Informatica" },
]

export default function AlunosAdmin() {
    return (
        <main className="alunos-admin">
            <div className="head-bar">
                <SearchBar
                    placeholder='Pesquisar aluno'
                />
                <Button
                    text='Adicionar aluno'
                    type='contained'
                    onClick={() => { }}
                />
            </div>

            <div className="studant-table">
                <Table
                    header={alunos_header}
                    body={alunos}
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