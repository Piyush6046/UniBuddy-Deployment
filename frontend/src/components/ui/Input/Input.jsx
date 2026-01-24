/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA INPUT COMPONENT                               ║
 * ║         Custom form inputs with validation states                 ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React, { useState, forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    helperText,
    icon,
    iconPosition = 'left',
    disabled = false,
    required = false,
    className = '',
    id,
    name,
    ...props
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const wrapperClasses = [
        'nebula-input-wrapper',
        isFocused && 'nebula-input-wrapper--focused',
        error && 'nebula-input-wrapper--error',
        disabled && 'nebula-input-wrapper--disabled',
        icon && `nebula-input-wrapper--icon-${iconPosition}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {label && (
                <label className="nebula-input-label" htmlFor={id}>
                    {label}
                    {required && <span className="nebula-input-required">*</span>}
                </label>
            )}

            <div className="nebula-input-container">
                {/* Animated border */}
                <span className="nebula-input-border" />

                {/* Icon (left) */}
                {icon && iconPosition === 'left' && (
                    <span className="nebula-input-icon nebula-input-icon--left">{icon}</span>
                )}

                <input
                    ref={ref}
                    type={inputType}
                    id={id}
                    name={name}
                    className="nebula-input-field"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    required={required}
                    {...props}
                />

                {/* Password toggle */}
                {type === 'password' && (
                    <button
                        type="button"
                        className="nebula-input-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}

                {/* Icon (right) */}
                {icon && iconPosition === 'right' && (
                    <span className="nebula-input-icon nebula-input-icon--right">{icon}</span>
                )}
            </div>

            {/* Helper/Error text */}
            {(error || helperText) && (
                <span className={`nebula-input-helper ${error ? 'nebula-input-helper--error' : ''}`}>
                    {error || helperText}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
