import './textInput.scss';

type Props = {

}

export default function TextInput({ }: Props) {
    return (
        <div className="text-input-continer">
            <input type="text" className="text-input" />
        </div>
    )
}