'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToasterContextValue {
  toasts: Toast[];
  toast: (props: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextValue | undefined>(undefined);

export function useToaster() {
  const context = useContext(ToasterContext);
  if (!context) throw new Error('useToaster must be used within a ToasterProvider');
  return context;
}

// Expose a singleton reference that will be set after context is available
export const toaster = {
  // This will be properly initialized in ToasterProvider
  _context: null as ToasterContextValue | null,

  toast(props: Omit<Toast, 'id'>) {
    if (this._context) {
      this._context.toast(props);
    } else {
      console.warn('Toaster not initialized yet');
    }
  },
};

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback(
    (props: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { ...props, id };
      setToasts(prev => [...prev, newToast]);

      if (props.duration !== undefined && props.duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, props.duration);
      }
    },
    [dismiss]
  );

  // Store context value in the singleton reference
  const contextValue = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
  React.useEffect(() => {
    toaster._context = contextValue;
    return () => {
      toaster._context = null;
    };
  }, [contextValue]);

  return (
    <ToasterContext.Provider value={contextValue}>
      {children}
      <Toaster />
    </ToasterContext.Provider>
  );
}

export const Toaster = () => {
  const { toasts, dismiss } = useToaster();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-md shadow-md w-80
            ${
              toast.type === 'success'
                ? 'bg-green-100 border-l-4 border-green-500'
                : toast.type === 'error'
                  ? 'bg-red-100 border-l-4 border-red-500'
                  : toast.type === 'warning'
                    ? 'bg-yellow-100 border-l-4 border-yellow-500'
                    : toast.type === 'loading'
                      ? 'bg-blue-100 border-l-4 border-blue-500'
                      : 'bg-gray-100 border-l-4 border-gray-500'
            }`}
        >
          <div className="flex-1 max-w-full">
            {toast.title && <div className="font-medium">{toast.title}</div>}
            {toast.description && <div className="text-sm">{toast.description}</div>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="ml-4 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
