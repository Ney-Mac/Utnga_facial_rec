import { TopMenu } from '../../components/top_menu/TopMenu';
import { NotificationRow, SearchBar } from '../../components';
import './teacherDashboard.scss';

const ntfs = [
    { name: 'Antonilson Miranda', cause: 'Não justificado.' },
    { name: 'Marcelino Kanjala', cause: 'Atraso por pagamento de propina' },
]

const presentes = [
    { nome: 'Marcelo Agostinho Mariano' },
    { nome: 'Juliano Kabingano' },
    { nome: 'Mauro Praia' },
    { nome: 'Densel Fernades' },
    { nome: 'Celcio Kavalo' },
]

export default function TeacherDashboard() {
    const onPermit = () => {

    }

    const onReject = () => {

    }

    return (
        <main className="teacher-dashboard-container">
            <TopMenu />

            <div className="container">
                <div className="requirements-container">
                    <h2 className="title">Solicitações:</h2>

                    {ntfs.map((ntf, index) => (
                        <NotificationRow
                            key={index}
                            studantName={ntf.name}
                            cause={ntf.cause}
                            onPermit={onPermit}
                            onReject={onReject}
                        />
                    ))}
                </div>

                <div className="search-container">
                    <SearchBar placeholder='Pesquisar aluno' />
                </div>

                <div className="presents-container">
                    <h2 className="title">Alunos Presentes</h2>

                    {presentes.map((aluno, index) => (
                        <p className="list-item" key={index}>{aluno.nome}</p>
                    ))}
                </div>
            </div>
        </main>
    )
}