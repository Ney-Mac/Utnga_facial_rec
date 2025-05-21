import { useState } from 'react';

import {
    DayCard,
    SearchBar,
    Button,
    ClassListRow,
    ModalAdm,
} from '../../components';

import './turmas.scss';

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const turmas = [
    { cod: 'EIMK1.1', tech: 'Martinho Kassequele', status: 'Em aulas', room: '1' },
    { cod: 'EIMK1.2', tech: 'João Paulo', status: 'Em aulas', room: '14' },
    { cod: 'EIMK1.3', tech: 'Simão Cândido', status: 'Em aulas', room: '3' },
    { cod: 'EIMK2.1', tech: 'João Paulo', status: 'Livre', room: '2' },
    { cod: 'EIMK2.2', tech: 'Simão Cândido', status: 'Livre', room: '24' },
    { cod: 'EIMK3.1', tech: 'imão Cândido', status: 'Livre', room: '11' },
    { cod: 'EIMK3.2', tech: 'Martinho Kassequele', status: 'Livre', room: '15' },
    { cod: 'EIMK4.1', tech: 'Martinho Kassequele', status: 'Livre', room: '5' },
]

const Home = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <main className="home">
            <div className="row-day-card">
                {days.map((day, index) => (
                    <DayCard day={day} key={index} />
                ))}
            </div>

            <div className="row-search-btn">
                <SearchBar
                    placeholder='Turma, sala'
                    onSearch={() => { }}
                />
                <Button text='Adicionar Turma' onClick={() => { setShowModal(true) }} />
            </div>

            <div className="class-list">
                <div className="class-list-row-title">
                    <p className="title-item">Turma</p>
                    <p className="title-item">Sala</p>
                    <p className="title-item">Professor</p>
                    <p className="title-item">Estado</p>
                </div>

                {turmas.map((turma, index) => (
                    <ClassListRow
                        key={index}
                        room={turma.room}
                        classCod={turma.cod}
                        classTeacher={turma.tech}
                        status={turma.status}
                    />
                ))}
            </div>

            <ModalAdm
                show={showModal}
                setShow={setShowModal}
            />
        </main>
    )
}

export default Home;