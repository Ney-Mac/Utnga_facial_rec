import { CiSearch } from "react-icons/ci";
import './searchBar.scss';

type Props = {
    placeholder: string;
    onSearch: () => void;
    label?: string;
}

const SearchBar = ({ placeholder, onSearch, label }: Props) => {
    return (
        <div className="search-bar-container">
            {label && <p className="label">{label}</p>}
            <div className="search-bar">
                <CiSearch className="search-icon" />
                <input
                    placeholder={placeholder}
                    className="search-input"
                    onSubmit={onSearch}
                />
            </div>
        </div>
    )
}

export default SearchBar;