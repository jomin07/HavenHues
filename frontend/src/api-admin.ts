import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AdminSignIn = async(formData: SignInFormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/admin-auth/admin-login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(formData),
    });

    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.message);
    }
    return body;
};

export const validateAdminToken = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/admin-auth/validate-adminToken`,{
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Token invalid");
    }

    return response.json();
}

export const AdminSignOut = async() =>{
    const response = await fetch(`${API_BASE_URL}/api/admin-auth/admin-logout`, {
        credentials: "include",
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Error during sign out");
    }
}