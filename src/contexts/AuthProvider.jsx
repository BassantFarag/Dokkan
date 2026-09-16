import { AuthContext } from "./AuthContext";
import{
    login as loginApi,
    logout as logoutApi,
    authMe as authMeApi
} from '../api/authApi'
import { useState, useEffect } from "react";


export const AuthProvider = ({children}) => {

    const tokenStorage = localStorage.getItem("token");
    const [token, setToken] = useState(tokenStorage);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify the stored token and restore the authenticated user on  initial load
    useEffect(() => {
        const fetchUser = async () => {
            if(token){
                try {
                    const response = await authMeApi();
                    setUser(response.data.user);
                } catch {
                    localStorage.removeItem("token");
                    setUser(null);
                    setToken(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        fetchUser();
    }, [])

    // Authenticate the user and store the token and user data 
    const  loginContext = async ( email , password ) => {
        const response = await loginApi({email, password});

        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);

        return response;
    }

    // Logout the user and clear the token and user data
    const logoutContext = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }
    }
    return (
        <AuthContext.Provider value={{token, user, loading,
        loginContext, logoutContext}}>
            {children}
        </AuthContext.Provider>
    )
}
