import { Outlet } from 'react-router-dom';
import './loginLayout.scss';

export default () => {
    return (
        <div className="login-layout">
            <Outlet />
        </div>
    )
}