import './classListRow.scss';

type Props = {
    classCod: string;
    classTeacher: string;
    room: string;
    status: string;
}

export default function classListRow({ classCod, room, classTeacher, status }: Props) {
    return (
        <div className='class-list-row'>
            <p className="item">{classCod}</p>
            <p className="item">{room}</p>
            <p className="item">{classTeacher}</p>
            <p className="item">{status}</p>
        </div>
    )
}