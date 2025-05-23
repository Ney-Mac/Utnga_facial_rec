import { MenuItem } from "../menu_ul_item/MenuItem";
import Logo from '../../assets/images/logo/logo_utanga.png';
import './sideMenu.scss';

export function SideMenu() {
    const links = [
        { to: `/adm/painel`, text: 'Painel de Monitoramento' },
        { to: `/adm/alunos`, text: 'Alunos' },
        { to: `/adm/profs`, text: 'Professores e Administradores' },
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