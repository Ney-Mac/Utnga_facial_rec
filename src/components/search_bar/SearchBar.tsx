import { CiSearch } from "react-icons/ci";
import './searchBar.scss';

type Props = {
    placeholder: string;
    onSearch: () => void;
    label?: string;
    value: string;
    changeValue: (value: string) => void;
    errorText?: string;
}

const SearchBar = ({ placeholder, onSearch, label, errorText, value, changeValue }: Props) => {
    return (
        <div className="search-bar-container">
            {label && <p className="label">{label}</p>}
            <div className="search-bar">
                <button type='button' onClick={() => { onSearch()  }}>
                    <CiSearch className="search-icon" />
                </button>
                <input
                    value={value}
                    onChange={(event) => { changeValue(event.target.value) }}
                    placeholder={placeholder}
                    className="search-input"
                    onSubmit={(event) => {
                        event.preventDefault();
                    }}
                />
            </div>
            {errorText && <p className="error-text">{errorText}</p>}
        </div>
    )
}

export default SearchBar;