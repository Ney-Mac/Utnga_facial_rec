import { CiSearch } from "react-icons/ci";
import './searchBar.scss';

type Props = {
    placeholder: string;
}

const SearchBar = ({ placeholder }: Props) => {
    return (
        <div className="search-bar-container">
            <CiSearch className="search-icon" />
            <input
                placeholder={placeholder}
                className="search-input"
            />
        </div>
    )
}

export default SearchBar;