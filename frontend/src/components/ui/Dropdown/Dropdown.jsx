/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA DROPDOWN COMPONENT                            ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({
    trigger,
    children,
    align = 'left',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`nebula-dropdown ${className}`} ref={dropdownRef}>
            <div
                className="nebula-dropdown__trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {trigger}
            </div>

            {isOpen && (
                <div className={`nebula-dropdown__menu nebula-dropdown__menu--${align}`}>
                    {React.Children.map(children, child =>
                        React.cloneElement(child, { onClick: () => setIsOpen(false) })
                    )}
                </div>
            )}
        </div>
    );
};

Dropdown.Item = ({ children, icon, onClick, danger = false, disabled = false }) => (
    <button
        className={`nebula-dropdown__item ${danger ? 'nebula-dropdown__item--danger' : ''} ${disabled ? 'nebula-dropdown__item--disabled' : ''}`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
    >
        {icon && <span className="nebula-dropdown__item-icon">{icon}</span>}
        <span>{children}</span>
    </button>
);

Dropdown.Divider = () => <div className="nebula-dropdown__divider" />;

Dropdown.Header = ({ children }) => (
    <div className="nebula-dropdown__header">{children}</div>
);

export default Dropdown;
