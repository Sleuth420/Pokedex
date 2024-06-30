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
        <div>
            <h1>Settings</h1>
            <label>
                Search:
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </label>
            <label>
                List Size:
                <input type="number" value={listSize} onChange={e => setListSize(parseInt(e.target.value, 10))} />
            </label>
        </div>
    );
};

export default Settings;
