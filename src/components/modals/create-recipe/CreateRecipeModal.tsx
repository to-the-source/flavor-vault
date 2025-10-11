import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CreateRecipeForm from './CreateRecipeForm';

interface CreateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const callClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', callEscape);
      document.addEventListener('mousedown', callClickOutside);
      // Stop body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', callEscape);
      document.removeEventListener('mousedown', callClickOutside);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', callEscape);
      document.removeEventListener('mousedown', callClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-green-200/90">
        <div 
          ref={modalRef}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
        >
          {/* Create Recipe Modal Header */}
          <div className="p-6 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Create New Recipe</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
          </div>
          
          {/* Create Recipe Modal */}
          <div className="p-6 overflow-y-auto flex-1">
            <CreateRecipeForm />
            {children}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="create-recipe-form" 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Create Recipe
              </button>
            </div>
          </div>
      </div>
    </div>,
    document.body 
  );
};

export default CreateRecipeModal;