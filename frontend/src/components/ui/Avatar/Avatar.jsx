/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA AVATAR COMPONENT                              ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './Avatar.css';

const Avatar = ({
    src,
    alt = '',
    name,
    size = 'md',
    status,
    ring = false,
    className = '',
    ...props
}) => {
    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const classes = [
        'nebula-avatar',
        `nebula-avatar--${size}`,
        ring && 'nebula-avatar--ring',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {src ? (
                <img src={src} alt={alt} className="nebula-avatar__image" />
            ) : (
                <span className="nebula-avatar__initials">{getInitials(name)}</span>
            )}
            {status && (
                <span className={`nebula-avatar__status nebula-avatar__status--${status}`} />
            )}
        </div>
    );
};

// Avatar Group
Avatar.Group = ({ children, max = 5, size = 'md' }) => {
    const avatars = React.Children.toArray(children);
    const displayed = avatars.slice(0, max);
    const remaining = avatars.length - max;

    return (
        <div className="nebula-avatar-group">
            {displayed.map((avatar, index) =>
                React.cloneElement(avatar, {
                    key: index,
                    size,
                    style: { zIndex: displayed.length - index }
                })
            )}
            {remaining > 0 && (
                <div className={`nebula-avatar nebula-avatar--${size} nebula-avatar--count`}>
                    <span className="nebula-avatar__initials">+{remaining}</span>
                </div>
            )}
        </div>
    );
};

export default Avatar;
