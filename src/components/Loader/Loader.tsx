import { useContext } from 'react';
import { LoadContext } from '../../contexts/LoadContext';
import './loader.scss';

export default function Loader() {
    const { isLoading } = useContext(LoadContext);

    return (
        <>{isLoading && <div className="loader-container">
            <div className="loader"></div>
        </div>}</>
    )
}