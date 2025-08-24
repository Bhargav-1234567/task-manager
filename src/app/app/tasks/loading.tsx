    export default function Loading() {  
        const columns = [1, 2, 3]; // Example: 3 columns

      return <div className="flex gap-6 p-6 overflow-x-auto animate-pulse">
      {columns.map((col) => (
        <div
          key={col}
          className="flex-1 min-w-[280px] bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
        >
          {/* Column title */}
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4" />

          {/* Fake tasks */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 space-y-2 shadow"
              >
                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
                <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>;
    }