import './textInput.scss';

type Props = {
    placeholder: string;
    value: string;
    changeValue: (value: string) => void;
    errorText?: string;
    label?: string;
}

export default function TextInput({ placeholder, value, changeValue, errorText, label }: Props) {
    const onChange = (value: string) => {
        changeValue(value);
    }

    return (
        <div className="text-input-container">
            {label && <p className='label'>{label}</p>}

            <div className="input-container">
                <input
                    placeholder={placeholder}
                    type="text"
                    className="text-input"
                    value={value}
                    onChange={(e) => { onChange(e.target.value) }}
                />
            </div>

            {errorText && <p className='error-text'>{errorText}</p>}
        </div>
    )
}