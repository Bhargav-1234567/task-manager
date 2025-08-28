'use client';

import { useEffect, useState } from 'react';
import Toast from '@/components/ui/Toast';

export default function ToastProvider() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <Toast />;
}