import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { MenuItem } from "../menu_ul_item/MenuItem";
import Logo from '../../assets/images/logo/logo_utanga.png';
import './sideMenu.scss';

export function SideMenu() {
    const { user } = useContext(AuthContext)!;

    const links = [
        { to: `/adm/${user?.id}/turmas`, text: 'Turmas' },
        { to: `/adm/${user?.id}/alunos`, text: 'Alunos' },
        { to: `/adm/${user?.id}/profs`, text: 'Professores e Administradores' },
    ]

    return (
        <aside className="side-menu">
            <div className="menu-title">
                <img src={Logo} alt="Logo Utanga" id="logo" />
                <h3 className="menu-title-text">UTANGA</h3>
            </div>

            <nav className="menu-nav">
                <ul className="menu-ul">
                    {links.map((link, index) => (
                        <MenuItem key={index} to={link.to}>{link.text}</MenuItem>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}