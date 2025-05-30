import { useState } from "react";

import { Outlet } from "react-router-dom";
import { Loader } from "../../components";

import { SideMenu } from "../../components/side_menu/SideMenu";
import { TopMenu } from "../../components/top_menu/TopMenu";

import './menuLayout.scss';

export default () => {
    const [showSideMenu, setShowSideMenu] = useState(true);

    const toggleSideMenu = () => {
        setShowSideMenu(!showSideMenu);
    }

    return (
        <div className={`main-layout ${showSideMenu ? '' : 'collapsed'}`}>
            <Loader />            
            <SideMenu />
            <TopMenu handleSideMenu={toggleSideMenu} />
            <div className="outlet">
                <Outlet />
            </div>
        </div>
    )
}