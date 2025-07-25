import { createContext, useEffect, useRef, useState } from "react";
import { AppConstants } from "../util/AppConstants";
import { toast } from "react-toastify";
import { createApiInstance } from "../util/axiosInstance";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = AppConstants.BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({});
    const [authLoading, setAuthLoading] = useState(true);
    const api = createApiInstance(backendUrl);

    useEffect(() => {
        checkUserSession();
    }, []);

    useEffect(() => {
        const handleRefreshTokenFailed = () => {
            toast.error("Session expired. Please log in again.");
            setIsLoggedIn(false);
            setUserData({});
        };

        window.addEventListener("refreshTokenFailed", handleRefreshTokenFailed);

        return () => {
            window.removeEventListener("refreshTokenFailed", handleRefreshTokenFailed);
        };
    }, []);

    const checkUserSession = async () => {
        try {
            const response = await api.get(`${backendUrl}/profile/get-profile`, {
                withCredentials: true,
            });
            setUserData(response.data.data);
            setIsLoggedIn(true);
        } catch (err) {
            if (err.response?.status === 401) {
                return;
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const getUserData = async () => {
        try {
            const response = await api.get(`${backendUrl}/profile/get-profile`, { withCredentials: true });
            if (response.status === 200) {
                setUserData(response.data.data);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Unable to fetch your profile details.";
            toast.error(message);
        }
    };

    const contextValue = {
        api,
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        authLoading,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>
    );
};