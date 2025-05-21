import './inputFile.scss';

type Props = {
    placeholder: string;
    // file: string;
    loadFile: (file: File | undefined) => void;
    errorText?: string;
    label?: string;
}

export default function InputFile({ placeholder, loadFile, errorText,label }: Props) {
    const onLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        loadFile(e.target.files?.[0]);
    }

    return (
        <div className="input-file">
            {label && <p className='label'>{label}</p>}

            <div className="input-file-container">
                <input
                    placeholder={placeholder}
                    type='file'
                    accept='image/*'
                    className='file-input'
                    // value={file}
                    onChange={onLoadFile}
                />
            </div>

            {errorText && <p className='error-text'>{errorText}</p>}
        </div>
    )
}