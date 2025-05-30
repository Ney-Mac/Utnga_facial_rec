import './table.scss';

type Props<T> = {
    header: string[];
    body: T[];
    renderRow: (item: T) => React.ReactNode;
    useGrid?: boolean;
}

export default function Table<T>({ header, body, renderRow, useGrid }: Props<T>) {
    return (
        <div className="table">
            <div className={`header ${useGrid ? 'grid': ''}`}>
                {header.map((cell, index) => (
                    <p key={index} className="header-cell">{cell.toUpperCase()}</p>
                ))}
            </div>
            <div className={`body`}>
                {body.map((item, index) => (
                    <div className={`row ${useGrid ? 'grid': ''}`} key={index}>
                        {renderRow(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}