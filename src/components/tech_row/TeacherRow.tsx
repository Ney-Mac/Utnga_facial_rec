import { IconButton } from '../icon_button/IconButton';
import { FaCheck } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import './teacherRow.scss';

type Props = {
    studantName: string;
    cause: string;
    onPermit: () => void;
    onReject: () => void;
}

export default function TeacherRow({ studantName, cause, onPermit, onReject }: Props) {
    return (
        <div className="teacher-container-row">
            <div className="left">
                <p className="name">Aluno: <span>{studantName}</span></p>
                <p className="cause">Motivo: <span>{cause}</span></p>
            </div>

            <div className="right">
                <IconButton classList='btn-permit' title='Permitir acesso de aluno' Icon={FaCheck} onClick={onPermit} />
                <IconButton classList='btn-reject' title='Negar acesso de aluno' Icon={FaPlus} onClick={onReject} />
            </div>
        </div>
    )
}