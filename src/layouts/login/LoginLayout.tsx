import { Outlet } from 'react-router-dom';
import { Loader } from '../../components';
import './loginLayout.scss';

export default () => {
    return (
        <div className="login-layout">
            <Loader />
            <Outlet />
        </div>
    )
}