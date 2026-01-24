/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA EMPTY STATE COMPONENT                         ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './EmptyState.css';

const EmptyState = ({
    icon,
    title,
    description,
    action,
    variant = 'default',
    className = '',
}) => {
    const defaultIcons = {
        default: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
                <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.5" />
            </svg>
        ),
        search: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="36" cy="36" r="20" opacity="0.5" />
                <line x1="50" y1="50" x2="65" y2="65" strokeLinecap="round" opacity="0.5" />
                <path d="M32 32l8 8M40 32l-8 8" strokeLinecap="round" opacity="0.3" />
            </svg>
        ),
        error: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="40" cy="40" r="30" opacity="0.3" />
                <path d="M28 28l24 24M52 28L28 52" strokeLinecap="round" opacity="0.5" />
            </svg>
        ),
        data: (
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="15" y="20" width="50" height="40" rx="4" opacity="0.3" />
                <line x1="15" y1="35" x2="65" y2="35" opacity="0.3" />
                <line x1="25" y1="28" x2="35" y2="28" opacity="0.5" />
                <line x1="25" y1="45" x2="55" y2="45" opacity="0.3" />
                <line x1="25" y1="52" x2="45" y2="52" opacity="0.3" />
            </svg>
        ),
    };

    return (
        <div className={`nebula-empty-state nebula-empty-state--${variant} ${className}`}>
            <div className="nebula-empty-state__icon">
                {icon || defaultIcons[variant] || defaultIcons.default}
            </div>

            {title && (
                <h3 className="nebula-empty-state__title">{title}</h3>
            )}

            {description && (
                <p className="nebula-empty-state__description">{description}</p>
            )}

            {action && (
                <div className="nebula-empty-state__action">{action}</div>
            )}
        </div>
    );
};

export default EmptyState;
