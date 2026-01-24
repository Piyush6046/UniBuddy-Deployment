/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA CARD COMPONENT                                ║
 * ║         Versatile card with multiple variants                     ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    hoverable = true,
    padding = 'md',
    className = '',
    onClick,
    ...props
}) => {
    const classes = [
        'nebula-card',
        `nebula-card--${variant}`,
        `nebula-card--padding-${padding}`,
        hoverable && 'nebula-card--hoverable',
        onClick && 'nebula-card--clickable',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick} {...props}>
            {/* Gradient border accent */}
            <span className="nebula-card__accent" />

            {/* Content */}
            <div className="nebula-card__content">
                {children}
            </div>
        </div>
    );
};

// Sub-components
Card.Header = ({ children, className = '' }) => (
    <div className={`nebula-card__header ${className}`}>
        {children}
    </div>
);

Card.Title = ({ children, className = '' }) => (
    <h3 className={`nebula-card__title ${className}`}>
        {children}
    </h3>
);

Card.Subtitle = ({ children, className = '' }) => (
    <p className={`nebula-card__subtitle ${className}`}>
        {children}
    </p>
);

Card.Body = ({ children, className = '' }) => (
    <div className={`nebula-card__body ${className}`}>
        {children}
    </div>
);

Card.Footer = ({ children, className = '' }) => (
    <div className={`nebula-card__footer ${className}`}>
        {children}
    </div>
);

Card.Image = ({ src, alt, className = '' }) => (
    <div className={`nebula-card__image ${className}`}>
        <img src={src} alt={alt} />
    </div>
);

export default Card;
