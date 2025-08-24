import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  List, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Settings, 
  Plus,
  Sun,
  Moon,
  LayoutGrid
} from 'lucide-react';

const TasksHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('board');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const views = [
    { id: 'board', label: 'Board', icon: LayoutGrid },
    { id: 'list', label: 'List', icon: List },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'more', label: 'More view', icon: MoreHorizontal }
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <header className="pb-3  ">
        <div className="flex items-center justify-between">
          {/* Left Section - View Tabs */}
          <div className="flex items-center space-x-1">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium 
                    ${activeView === view.id 
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{view.label}</span>
                  {view.id === 'more' && (
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section - Search, Filter, Settings, Theme Toggle, Add */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search in view..."
                className="
                  w-64 pl-10 pr-4 py-2 text-sm  bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-700 
                  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                  
                "
              />
            </div>

            {/* Filter */}
            <button className="
              flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 
              hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 
              rounded-md transition-colors duration-150
            ">
              <Filter size={16} />
              <span>Filter</span>
            </button>

            {/* Customize */}
            <button className="
              flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 
              hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 
              rounded-md transition-colors duration-150
            ">
              <Settings size={16} />
              <span>Customize</span>
            </button>

            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className="
                p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 
                hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-150
              "
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button> */}

            {/* Add Button */}
            <button className="
              flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium 
              rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              dark:focus:ring-offset-gray-900
            ">
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default TasksHeader;