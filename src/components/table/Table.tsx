import './table.scss';

type Props<T> = {
    header: string[];
    body: T[];
    renderRow: (item: T) => React.ReactNode;
}

export default function Table<T>({ header, body, renderRow }: Props<T>) {
    return (
        <div className="table">
            <div className="header">
                {header.map((cell, index) => (
                    <p key={index} className="header-cell">{cell.toUpperCase()}</p>
                ))}
            </div>
            <div className="body">
                {body.map((item, index) => (
                    <div className="row" key={index}>
                        {renderRow(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}