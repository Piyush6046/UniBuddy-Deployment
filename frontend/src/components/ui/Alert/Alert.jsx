/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA ALERT COMPONENT                               ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './Alert.css';

const Alert = ({
    children,
    variant = 'info',
    title,
    icon,
    dismissible = false,
    onDismiss,
    className = '',
    ...props
}) => {
    const defaultIcons = {
        info: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
        success: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        warning: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
        error: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    };

    const classes = [
        'nebula-alert',
        `nebula-alert--${variant}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} role="alert" {...props}>
            <span className="nebula-alert__icon">
                {icon || defaultIcons[variant]}
            </span>

            <div className="nebula-alert__content">
                {title && <div className="nebula-alert__title">{title}</div>}
                <div className="nebula-alert__message">{children}</div>
            </div>

            {dismissible && (
                <button
                    className="nebula-alert__dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss alert"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Alert;
