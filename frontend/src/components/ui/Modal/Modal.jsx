/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA MODAL COMPONENT                               ║
 * ║         Accessible modal with animations                          ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    closeOnBackdrop = true,
    className = '',
}) => {
    const modalRef = useRef(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Focus trap
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div className={`nebula-modal-overlay ${isOpen ? 'nebula-modal-overlay--active' : ''}`}>
            {/* Backdrop */}
            <div
                className="nebula-modal-backdrop"
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={`nebula-modal nebula-modal--${size} ${className}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
            >
                {/* Decorative glow */}
                <span className="nebula-modal__glow" />

                {/* Header */}
                {(title || showClose) && (
                    <div className="nebula-modal__header">
                        {title && (
                            <h2 id="modal-title" className="nebula-modal__title">{title}</h2>
                        )}
                        {showClose && (
                            <button
                                className="nebula-modal__close"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="nebula-modal__body">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

// Sub-components
Modal.Footer = ({ children, className = '' }) => (
    <div className={`nebula-modal__footer ${className}`}>
        {children}
    </div>
);

export default Modal;
