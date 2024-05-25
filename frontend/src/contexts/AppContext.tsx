import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import * as apiAdmin from "../api-admin";

type ToastMessage = {
    message: string,
    type: "SUCCESS" | "ERROR";
}

type AppContext = {
    showToast: (toastMessage: ToastMessage) => void,
    isLoggedIn: boolean;
    isAdminLoggedIn: boolean;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({children}: { children: React.ReactNode }) =>{
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const { isError } = useQuery("validateToken", apiClient.validateToken, {
        retry: false,
    });

    const { isError: isAdminError } = useQuery('validateAdminToken', apiAdmin.validateAdminToken,{
        retry: false,
    });

    return(
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
                setToast(toastMessage);
            },
            isLoggedIn: !isError,
            isAdminLoggedIn: !isAdminError,
        }}>
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(undefined)} 
                />
            )}
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () =>{
    const context = useContext(AppContext);
    return context as AppContext;
}