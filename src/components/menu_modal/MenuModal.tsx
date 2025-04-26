import './menuModal.scss';

type Props = {
    children: React.ReactNode;
}

export function MenuModal({ children }: Props) {
    const onClick = (event: any) => {
        console.log(typeof event);
        console.log();
        console.log(event.target);
    }

    return (
        <div className="menu-modal" onClick={(event) => { onClick(event) }}>{children}</div>
    )
}