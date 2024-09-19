import { createContext,useContextmuseState } from 'react';

export const AuthContext = createContext();

export const useAuth = ((children) => {
    const [auth, setAuth] = useState(JSON.parse.localStorage.getItem('chatapp') || null);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}) 