import { useState, useRef, useEffect } from 'react';

import {
    TextInput,
    Button,
    Schedule,
} from '../';

import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";

import { SelectedType } from '../schedule/Schedule';

import './modal.scss';

type Props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

type InputType = {
    value: string;
    error: string;
}

const turnos = ['manhã', 'tarde', 'manha']

export default function Modal({ show, setShow }: Props) {
    const [activePage, setActivePage] = useState(1);
    const [pages, setPages] = useState<number[]>([]);

    const [scheduleList, setScheduleList] = useState<SelectedType>([]);
    const [scheduleError, setScheduleError] = useState('');

    const [curso, setCurso] = useState<InputType>({ value: '', error: '' });
    const [ano, setAno] = useState<InputType>({ value: '', error: '' });
    const [sala, setSala] = useState<InputType>({ value: '', error: '' });
    const [turno, setTurno] = useState<InputType>({ value: '', error: '' });

    const stepperPageRef = useRef<HTMLDivElement>(null);

    const onClose = () => {
        setShow(false);
    }

    const stopClickPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    const onNextPage = () => {
        const cursoError = curso.value === '' ? 'Preencha este campo' : '';
        const anoError = ano.value === '' ? 'Preencha este campo' : '';
        const salaError = sala.value === '' ? 'Preencha este campo' : '';
        const turnoError = turno.value === '' ? 'Preencha este campo' : (turnos.includes(turno.value.toLowerCase())) ? '' : 'Selecione um dos turnos disponíveis (Manhã | Tarde)';
        const scheduleError = scheduleList.length === 0 && activePage === 2 ? 'Selecione os dias e horas antes de prosseguir!' : '';

        if (cursoError || anoError || salaError || turnoError || scheduleError) {
            setCurso({ ...curso, error: cursoError });
            setAno({ ...ano, error: anoError });
            setSala({ ...sala, error: salaError });
            setTurno({ ...turno, error: turnoError });
            setScheduleError(scheduleError);

            return;
        }

        if (activePage < pages.length) {
            setActivePage(activePage + 1);
            return;
        }

        addClass();
    }

    const addClass = () => {
        //Chamar API

        setScheduleList([]);
        setScheduleError('');
        setCurso({ value: '', error: '' });
        setAno({ value: '', error: '' });
        setSala({ value: '', error: '' });
        setTurno({ value: '', error: '' });
        setActivePage(1);

        onClose();
    }

    const onPrevPage = () => {
        if (activePage > 1) {
            setActivePage(activePage - 1);
        } else {
            onClose();
        }
    }

    useEffect(() => {
        if (stepperPageRef.current) {
            const numOfPages = stepperPageRef.current.childElementCount;
            const _pages: number[] = [];

            for (let i = 1; i <= numOfPages; i++) {
                _pages.push(i);
            }

            setPages(_pages);
        }
    }, []);

    return (
        <>{
            show && <div className="modal-papper" onClick={onClose}>
                <div className="modal-container">

                    <div className="modal-content-container" onClick={stopClickPropagation}>
                        <div className="stepper">
                            {pages.map((page, index) => (
                                <div
                                    key={index}
                                    className={
                                        `num-container
                                        ${(index < pages.length - 1) ? 'after' : ''}
                                        ${(index + 1 <= activePage) ? 'active' : ''}
                                        ${(index < activePage - 1) ? 'next' : ''}
                                        `
                                    }
                                >
                                    <div className="number">
                                        {activePage > page ? <FaCheck className='number-icon' /> : <p>{page}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pages" ref={stepperPageRef}>
                            <div className={`page ${activePage === 1 ? '' : 'hide'}`}>
                                <TextInput
                                    label='Digite o nome do curso:'
                                    placeholder='Curso'
                                    value={curso.value}
                                    changeValue={(value) => { setCurso({ value: value, error: '' }) }}
                                    errorText={curso.error}
                                />

                                <TextInput
                                    label='Digite o ano acadêmico'
                                    placeholder='Ano'
                                    value={ano.value}
                                    changeValue={(value) => { setAno({ value: value, error: '' }) }}
                                    errorText={ano.error}
                                />

                                <TextInput
                                    label='Digite a sala'
                                    placeholder='Sala'
                                    value={sala.value}
                                    changeValue={(value) => { setSala({ value: value, error: '' }) }}
                                    errorText={sala.error}
                                />

                                <TextInput
                                    label='Digite o turno'
                                    placeholder='Manhã, tarde...'
                                    value={turno.value}
                                    changeValue={(value) => { setTurno({ value: value, error: '' }) }}
                                    errorText={turno.error}
                                />
                            </div>

                            <div className={`page ${activePage === 2 ? '' : 'hide'}`}>
                                <Schedule
                                    selected={scheduleList}
                                    setSelected={setScheduleList}
                                    turn={
                                        turno.value.toLowerCase() === 'manha' ||
                                            turno.value.toLowerCase() === 'manhã' ?
                                            'morning' : 'afternoon'
                                    }
                                    runOnSelect={() => { setScheduleError('') }}
                                />
                                {scheduleError && <p className="schedule-error">{scheduleError}</p>}
                            </div>

                            <div className={`info-page page ${activePage === 3 ? '' : 'hide'}`}>
                                <h3>Verificar informações</h3>

                                <p>Curso: <span>{curso.value}</span></p>
                                <p>Ano: <span>{ano.value}</span></p>
                                <p>Sala: <span>{sala.value}</span></p>

                                <div className="days">
                                    <p>Dias:</p>

                                    {[...scheduleList].reverse().map((value, index) => (
                                        <div className="day" key={index}>
                                            <p>- <span> {value.dia} {`{ ${value.horaInicio}-${value.horaFim} }`}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="btn-container">
                            <Button
                                text={`${activePage === 1 ? 'Cancelar' : 'Voltar'}`}
                                type='cancel'
                                onClick={onPrevPage}
                                icon={{
                                    Icon: activePage === 1 ? RiCloseLargeFill : FaArrowLeft,
                                    side: 'left'
                                }}
                            />
                            <Button
                                text={`${activePage < pages.length ? 'Próximo' : 'Adicionar'}`}
                                onClick={onNextPage}
                                icon={{
                                    Icon: activePage === pages.length ? FaCheck : FaArrowRight,
                                    side: 'right'
                                }}
                            />
                        </div>
                    </div>

                    <div className="legendas">
                        <h3 className="title">Notas e Legendas</h3>
                        <p>N1: <span>Cada turma corresponde únicamente a uma cadeira.</span></p>
                        <p>N2: <span>Turnos disponíveis: Manhã e Tarde.</span></p>
                        <p>N3: <span>Clique no calendário para selecionar o horário e dia correspondente.</span></p>
                        <p>N4: <span>Após preencher, verifique as informações com cuidado.</span></p>
                    </div>
                </div>
            </div>
        }</>
    )
}