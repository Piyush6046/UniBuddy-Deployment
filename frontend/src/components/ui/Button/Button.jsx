/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA BUTTON COMPONENT                              ║
 * ║         Custom-designed button with micro-interactions            ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseClasses = 'nebula-button';
    const variantClasses = `nebula-button--${variant}`;
    const sizeClasses = `nebula-button--${size}`;
    const stateClasses = [
        loading && 'nebula-button--loading',
        disabled && 'nebula-button--disabled',
        fullWidth && 'nebula-button--full',
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {/* Animated background glow */}
            <span className="nebula-button__glow" />

            {/* Button content */}
            <span className="nebula-button__content">
                {loading ? (
                    <span className="nebula-button__loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                ) : (
                    <>
                        {icon && iconPosition === 'left' && (
                            <span className="nebula-button__icon nebula-button__icon--left">{icon}</span>
                        )}
                        <span className="nebula-button__text">{children}</span>
                        {icon && iconPosition === 'right' && (
                            <span className="nebula-button__icon nebula-button__icon--right">{icon}</span>
                        )}
                    </>
                )}
            </span>

            {/* Ripple effect container */}
            <span className="nebula-button__ripple" />
        </button>
    );
};

export default Button;
