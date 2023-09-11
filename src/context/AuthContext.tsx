import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { Login } from "../service";
import { LoginProps, User } from "../types/Users";
import { useNavigate } from "react-router-dom";
import { Api } from "../service/api";

type AuthData = {
    isAuthenticated: boolean;
    signIn: ({ handle, password }: LoginProps) => Promise<void>;
    logout: () => void;
    user?: User
    token?: string
}

const AuthContext = createContext<AuthData | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}')
    const [user, setUser] = useState(userInfo || {});
    const [token, setToken] = useState(userInfo || {});
     const signIn = async ({ handle, password}: LoginProps) => {
        try {
            const response = await Login({ handle, password })
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                navigate('/home');
                setUser(response.user)
                setToken(response.token)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate("/");
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token) {
            setIsAuthenticated(false);
            return 
        }
        if (user) {
            setUser(JSON.parse(user));
        }
        setIsAuthenticated(true);
    }, []);

    // const isAuthentic = () => {
    //     if (!token) {
    //         return false;
    //     }
    //     Api.defaults.headers.common.Authorization = `Bearer ${token.token}`;
    //     return true;
    // };

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, logout, user, token }}>
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