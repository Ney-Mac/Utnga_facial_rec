import { useEffect } from "react";

import { IoIosNotifications } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";

import { IconButton } from "../icon_button/IconButton";

import './topMenu.scss';

type Props = {
    handleSideMenu?: () => void;
}

export function TopMenu({ handleSideMenu }: Props) {
    const handleClickOutside = (event: MouseEvent) => {
        if ((event.target as HTMLElement).closest('.icon-button')) {
            console.log('Modal')
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <header className={`top-menu ${handleSideMenu ? 'space-between' : 'end'}`}>
            {
                handleSideMenu && <div className="toggle-side-menu">
                    <IconButton
                        Icon={CiMenuBurger}
                        onClick={handleSideMenu}
                    />
                </div>
            }

            <div className="user-data">
                <IconButton
                    Icon={IoIosNotifications}
                    dropContent={<h1>Teste 2</h1>}
                />
                <IconButton
                    Icon={FaRegUserCircle}
                    text="Deensel Whashington"
                    dropContent={<h1>Teste</h1>}
                />
            </div>
        </header>
    )
}