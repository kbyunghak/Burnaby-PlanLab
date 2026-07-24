import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function AppModal({
  isOpen,
  onRequestClose,
  contentLabel,
  overlayClassName,
  className,
  children,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onRequestClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onRequestClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={overlayClassName}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onRequestClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={contentLabel}
        className={className}
        tabIndex="-1"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default AppModal;
