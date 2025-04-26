import { useState } from 'react';
import { IconType } from 'react-icons';
import { MenuModal } from '../menu_modal/MenuModal';

import './iconButton.scss';

type Props = {
    Icon: IconType;
    text?: string;
    onClick?: () => void;
    dropContent?: React.ReactNode;
    classList?: string;
    title?: string;
}

export function IconButton({ Icon, text, title, onClick, dropContent, classList }: Props) {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(!showModal);
    }

    const onButtonClick = dropContent ? handleShowModal : onClick;

    return (
        <button title={title} className={`icon-button ${showModal ? 'active' : ''} ${classList}`} onClick={onButtonClick}>
            <Icon id='icon' />
            {text && <p className="icon-button-text">{text}</p>}
            {dropContent && showModal && <MenuModal>{dropContent}</MenuModal>}
        </button>
    )
}