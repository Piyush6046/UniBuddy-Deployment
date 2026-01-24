/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA LOADER COMPONENT                              ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './Loader.css';

const Loader = ({
    variant = 'orbit',
    size = 'md',
    color = 'primary',
    text,
    fullscreen = false,
    className = '',
}) => {
    const classes = [
        'nebula-loader',
        `nebula-loader--${variant}`,
        `nebula-loader--${size}`,
        `nebula-loader--${color}`,
        fullscreen && 'nebula-loader--fullscreen',
        className,
    ].filter(Boolean).join(' ');

    const renderLoader = () => {
        switch (variant) {
            case 'orbit':
                return (
                    <div className="nebula-loader__orbit">
                        <span className="nebula-loader__orbit-ring" />
                        <span className="nebula-loader__orbit-ring" />
                        <span className="nebula-loader__orbit-core" />
                    </div>
                );

            case 'dots':
                return (
                    <div className="nebula-loader__dots">
                        <span />
                        <span />
                        <span />
                    </div>
                );

            case 'pulse':
                return <div className="nebula-loader__pulse" />;

            case 'spinner':
                return (
                    <div className="nebula-loader__spinner">
                        <svg viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
                        </svg>
                    </div>
                );

            case 'wave':
                return (
                    <div className="nebula-loader__wave">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                );

            default:
                return <div className="nebula-loader__orbit" />;
        }
    };

    return (
        <div className={classes}>
            {renderLoader()}
            {text && <span className="nebula-loader__text">{text}</span>}
        </div>
    );
};

// Page loading overlay
Loader.Overlay = ({ visible, text }) => {
    if (!visible) return null;

    return (
        <div className="nebula-loader-overlay">
            <Loader variant="orbit" size="lg" text={text} />
        </div>
    );
};

export default Loader;
