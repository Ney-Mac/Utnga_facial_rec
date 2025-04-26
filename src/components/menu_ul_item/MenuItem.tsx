import { NavLink } from "react-router-dom";
import { IconType } from "react-icons";
import './menuItem.scss';

type Props = {
    to: string;
    children: React.ReactNode;
    Icon?: IconType;
}

export function MenuItem({ to, children, Icon }: Props) {
    return (
        <li className="menu-item">
            <NavLink to={to}>
                {Icon && <Icon className="menu-item-icon" />}
                {children}
            </NavLink>
        </li>
    )
} 