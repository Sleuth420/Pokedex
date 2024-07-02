import React, { createContext, useState, useContext, useEffect } from 'react';

// Create and export the context
export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listSize, setListSize] = useState(150); // Default list size
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <SettingsContext.Provider value={{ searchQuery, setSearchQuery, listSize, setListSize, isDarkMode, setIsDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

const Settings = () => {
  const { searchQuery, setSearchQuery, listSize, setListSize, isDarkMode, setIsDarkMode } = useContext(SettingsContext);

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded shadow-md dark:bg-gray-800">
      <h1 className="text-xl font-bold mb-4 dark:text-white">Settings</h1>
      <div className="flex flex-col gap-2">
        <label className="flex items-center">
          <span className="w-24 mr-2 dark:text-white">Search:</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center">
          <span className="w-24 mr-2 dark:text-white">List Size:</span>
          <input
            type="number"
            value={listSize}
            onChange={e => setListSize(parseInt(e.target.value, 10))}
            className="block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center">
          <span className="w-24 mr-2 dark:text-white">Dark Mode:</span>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={e => setIsDarkMode(e.target.checked)}
            className="block p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  );
};

export default Settings;
