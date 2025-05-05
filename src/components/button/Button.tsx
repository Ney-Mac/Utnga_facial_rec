import { IconType } from 'react-icons';
import './button.scss';

type Props = {
    text: string;
    type?: 'contained' | 'outlined' | 'cancel';
    onClick: () => void;
    icon?: {
        Icon: IconType;
        side: 'left' | 'right';
    }
}

const Button = ({ text, type = 'contained', onClick, icon }: Props) => {
    return (
        <button onClick={onClick} className={`button ${type}`}>
            {icon && icon.side === 'left' && <icon.Icon className='icon' />}
            {text}
            {icon && icon.side === 'right' && <icon.Icon className='icon' />}
        </button>
    )
}

export default Button;