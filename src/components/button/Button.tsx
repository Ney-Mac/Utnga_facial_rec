import './button.scss';

type Props = {
    text: string;
    type?: 'contained' | 'outlined' | 'cancel';
    onClick: () => void;
}

const Button = ({ text, type = 'contained', onClick }: Props) => {
    return (
        <button onClick={onClick} className={`button ${type}`}>{text}</button>
    )
} 

export default Button;