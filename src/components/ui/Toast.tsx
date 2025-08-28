'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  AlertCircle, 
  X 
} from 'lucide-react';
import { RootState } from '@/lib/store';
import { removeToast } from '@/lib/toastSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  useEffect(() => {
    const timeouts = toasts.map((toast) => {
      if (toast.duration && toast.duration > 0) {
        return setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration);
      }
      return null;
    });

    return () => {
      timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
    };
  }, [toasts, dispatch]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 dark:bg-green-600';
      case 'error':
        return 'bg-red-500 dark:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 dark:bg-blue-600';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center w-full max-w-sm p-4 rounded-lg shadow-lg
            text-white ${getBgColor(toast.type)}
            animate-in slide-in-from-right-10 duration-300
          `}
          role="alert"
        >
          {getIcon(toast.type)}
          <div className="ml-3 text-sm font-medium flex-1">
            {toast.message}
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-black/10 transition-colors"
            onClick={() => dispatch(removeToast(toast.id))}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;