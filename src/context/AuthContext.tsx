import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { Login } from "../service";
import { LoginProps } from "../types/Users";
import { useNavigate } from "react-router-dom";

type AuthData = {
    isAuthenticated: boolean;
    signIn: ({ handle, password }: LoginProps) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthData | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

     const signIn = async ({ handle, password}: LoginProps) => {
        try {
            const response = await Login({ handle, password })
            if (response.token) {
                localStorage.setItem("token", response.token);
                navigate('/home');
            }
        } catch (error) {
            console.log(error)
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            return 
        }
        setIsAuthenticated(true);
    })

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, logout }}>
        { children }
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext)
  
    if (!context) {
      throw new Error(
        'Você somente pode usar este hook debaixo de um <AuthContextProvider>'
      )
    }
  
    return context
  }