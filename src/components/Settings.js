import React, { createContext, useState, useContext } from 'react';

// Create and export the context
export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listSize, setListSize] = useState(20); // Default list size

  return (
    <SettingsContext.Provider value={{ searchQuery, setSearchQuery, listSize, setListSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Component for adjusting settings
const Settings = () => {
  const { searchQuery, setSearchQuery, listSize, setListSize } = useContext(SettingsContext);

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col gap-2">
        <label className="flex items-center">
          <span className="w-24 mr-2">Search:</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center">
          <span className="w-24 mr-2">List Size:</span>
          <input
            type="number"
            value={listSize}
            onChange={e => setListSize(parseInt(e.target.value, 10))}
            className="block w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  );
};

export default Settings;
