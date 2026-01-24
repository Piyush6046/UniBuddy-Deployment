/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA BADGE COMPONENT                               ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './Badge.css';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    icon,
    className = '',
    ...props
}) => {
    const classes = [
        'nebula-badge',
        `nebula-badge--${variant}`,
        `nebula-badge--${size}`,
        dot && 'nebula-badge--dot',
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {dot && <span className="nebula-badge__dot" />}
            {icon && <span className="nebula-badge__icon">{icon}</span>}
            {children}
        </span>
    );
};

export default Badge;
