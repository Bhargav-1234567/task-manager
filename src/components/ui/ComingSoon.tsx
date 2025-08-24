// components/ComingSoon.tsx
"use client";

import { Clock } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md mb-6">
        <Clock className="w-10 h-10 text-gray-600 dark:text-gray-300" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Coming Soon
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        We’re working hard to bring you this feature. Stay tuned for updates!
      </p>
    </div>
  );
}
