/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA TOOLTIP COMPONENT                             ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({
    children,
    content,
    position = 'top',
    delay = 200,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const showTooltip = () => {
        const id = setTimeout(() => setIsVisible(true), delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setIsVisible(false);
    };

    return (
        <div
            className={`nebula-tooltip-wrapper ${className}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            {isVisible && content && (
                <div className={`nebula-tooltip nebula-tooltip--${position}`}>
                    <span className="nebula-tooltip__content">{content}</span>
                    <span className="nebula-tooltip__arrow" />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
