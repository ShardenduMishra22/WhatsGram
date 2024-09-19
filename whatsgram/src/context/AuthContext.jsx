import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [auth, setAuthUser] = useState(() => JSON.parse(localStorage.getItem('chatapp')) || null);

    return (
        <AuthContext.Provider value={{ auth, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
