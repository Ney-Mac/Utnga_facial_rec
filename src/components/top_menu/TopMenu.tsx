import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { IconButton } from "../icon_button/IconButton";
import { Button } from '../';

import { CiMenuBurger } from "react-icons/ci";
import './topMenu.scss';

type Props = {
    handleSideMenu?: () => void;
}

export function TopMenu({ handleSideMenu }: Props) {
    const { onLogout } = useContext(AuthContext)!;

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
                <Button
                    text="Sair"
                    type="cancel"
                    onClick={onLogout}
                />
            </div>
        </header>
    )
}