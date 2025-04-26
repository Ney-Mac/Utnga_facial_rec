import './dayWeekCard.scss';

type Props = {
    day: string;
}

const DayWeekCard = ({ day }: Props) => {
    const today = 'Quarta'

    return (
        <div className={`day-card ${day === today ? 'today' : ''}`}>
            <p>{day}</p>
        </div>
    )
}

export default DayWeekCard;