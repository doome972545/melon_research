import React, { createContext, useState } from 'react';

// สร้าง Context สำหรับธีม
const ThemeContext = createContext();

// สร้าง Provider component สำหรับ ThemeContext
export const ThemeProvider = ({ children }) => {
    const [addMelonCost, setAddMelonCost] = useState(false);
    const [user, setUser] = useState({});

    return (
        <ThemeContext.Provider value={{
            addMelonCost,
            setAddMelonCost,
            user,
            setUser,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
