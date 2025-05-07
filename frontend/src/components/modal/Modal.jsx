import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, children, title }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="fixed inset-0 flex items-center justify-center">
        <div 
          ref={modalRef}
          className="bg-black border border-gray-800 rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-auto"
        >
          <div className="sticky top-0 z-10 flex items-center p-2 bg-black bg-opacity-80 backdrop-blur-sm">
            <button
              onClick={onClose}
              className="p-2 text-white rounded-full hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            {title && <h2 className="ml-4 text-xl font-bold">{title}</h2>}
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
