// components/SessionGrid.tsx
"use client";
import { Clock } from "lucide-react";
import React from "react";

interface Session {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  isActive: boolean;
  formattedDuration: string;
  formattedStartTime: string;
  formattedEndTime: string;
}

interface SessionGridProps {
  sessions: Session[];
}

const SessionGrid: React.FC<SessionGridProps> = ({ sessions }) => {
  return (
     <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Time Tracking History
        </h3>
      </div>
      
      {sessions && sessions.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sessions.map((session) => (
            <div key={session._id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Session
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {session.formattedStartTime} - {session.formattedEndTime}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {session.formattedDuration}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {session.duration}s total
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  session.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  {session.isActive ? 'Active' : 'Completed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No time tracking history available</p>
        </div>
      )}
    </div>
  );
};

export default SessionGrid;
