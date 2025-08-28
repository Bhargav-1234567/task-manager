import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addToast, ToastType } from '@/lib/toastSlice';

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
    dispatch(addToast({ type, message, duration: options?.duration }));
  }, [dispatch]);

  return {
    success: (message: string, options?: ToastOptions) => showToast('success', message, options),
    error: (message: string, options?: ToastOptions) => showToast('error', message, options),
    info: (message: string, options?: ToastOptions) => showToast('info', message, options),
    warning: (message: string, options?: ToastOptions) => showToast('warning', message, options),
  };
};