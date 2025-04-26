import { useState } from "react";

import { Outlet } from "react-router-dom";

import { SideMenu } from "../../components/side_menu/SideMenu";
import { TopMenu } from "../../components/top_menu/TopMenu";

import './mainLayout.scss';

export default () => {
    const [showSideMenu, setShowSideMenu] = useState(true);

    const toggleSideMenu = () => {
        setShowSideMenu(!showSideMenu);
    }

    return (
        <div className={`main-layout ${showSideMenu ? '' : 'collapsed'}`}>
            <SideMenu />
            <TopMenu handleSideMenu={toggleSideMenu} />
            <div className="outlet">
                <Outlet />
            </div>
        </div>
    )
}