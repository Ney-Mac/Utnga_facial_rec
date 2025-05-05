import { GiClick } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";
import './schedule.scss';

type Props = {
    turn: 'morning' | 'afternoon';
    selected: SelectedType;
    setSelected: React.Dispatch<React.SetStateAction<SelectedType>>;
    runOnSelect?: () => void;
}

export type SelectedType = {
    horaInicio: string;
    horaFim: string;
    dia: string;
    idRow: number;
    idCol: number;
}[]

const turno = {
    'morning': [
        '07h30 - 08h15',
        '08h20 - 09h05',
        '09h10 - 09h55',
        '10h00 - 10h45',
        '10h50 - 11h35',
        '11h40 - 12h25'
    ],
    'afternoon': [
        '13h00 - 13h45',
        '13h50 - 14h35',
        '14h40 - 15h25',
        '15h30 - 16h15',
        '15h20 - 17h05',
        '17h10 - 17h55'
    ]
}

const header = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']

export default function Schedule({ turn, setSelected, runOnSelect }: Props) {
    const onSelect = (event: React.MouseEvent, rowIndex: number, colIndex: number) => {
        const elClasses = event.currentTarget.classList;

        if (elClasses.contains('selected')) {
            elClasses.remove('selected');

            setSelected(prev => prev.filter(({ idCol, idRow }) => (idRow !== rowIndex && idCol !== colIndex)));
        } else {
            elClasses.add('selected');

            setSelected(prev => [
                {
                    horaFim: turno[turn][colIndex].split('-')[1],
                    horaInicio: turno[turn][colIndex].split('-')[0],
                    dia: header[rowIndex],
                    idCol: colIndex,
                    idRow: rowIndex
                },
                ...prev
            ]);
        }

        runOnSelect?.();
    }

    return (
        <div className="schedule">
            <div className="header">
                {
                    header.map((weekDay, index) => (
                        <p className="head" key={index}>{weekDay}</p>
                    ))
                }
            </div>
            <div className="hours">
                {
                    turno[turn].map((hora, index) => (
                        <p className="hour" key={index}>{hora}</p>
                    ))
                }
            </div>
            <div className="classes">
                {Array.from({ length: 6 }).map((_, colIndex) => {
                    return Array.from({ length: 5 }).map((_, rowIndex) => (
                        <button
                            onClick={(event) => {
                                onSelect(event, rowIndex, colIndex);
                            }}
                            className="class"
                            key={rowIndex}
                            title='Selecione dia e horario'
                        >
                            <GiClick />
                            <FaCheck />
                        </button>
                    ))
                })}
            </div>
        </div>
    )
}