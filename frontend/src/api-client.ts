import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { OtpFormData } from "./pages/VerifyOtp";
import { HotelSearchResponse, HotelType, UserType } from "../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCurrentUser = async (): Promise<UserType> =>{
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: "include",
    });

    if(!response.ok){
        throw new Error("Error fetching user");
    }

    return response.json();
}

export const register = async (formData: RegisterFormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if(!response.ok){
        throw new Error(responseBody.message);
    }

    return responseBody;
};

export const signIn = async(formData: SignInFormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

export const validateToken = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Token invalid");
    }

    return response.json();
}

export const signOut = async() =>{
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Error during sign out");
    }
}

export const addMyHotel = async (hotelFormData: FormData) =>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData
    });

    if (!response.ok) {
        throw new Error("Failed to add hotel");
    }

    return response.json();
}

export const fetchMyHotels = async (): Promise<HotelType[]> =>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include",
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
}

export const fetchMyHotelById = async(hotelID: string):Promise<HotelType> =>{
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelID}`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Error fetching hotel details");
    }

    return response.json();
}

export const updateMyHotelById = async(hotelFormData: FormData) =>{
    const response = await fetch(
        `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelID")}`,
        {
            method: "PUT",
            body: hotelFormData,
            credentials: "include"
        }
    );

    if(!response.ok){
        throw new Error("Failed to update Hotel");
    }

    return response.json();
}

export const verifyOtp = async (formData: OtpFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
  
    return response.json();
  };

export const resendOtp = async(formData: { email: string }) =>{
    const response = await fetch(`${API_BASE_URL}/api/users/resend-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    return responseBody;
}

export const requestPasswordReset = async(formData: { email: string }) =>{
    const response = await fetch(`${API_BASE_URL}/api/users/request-password-reset`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
}

export const resetPassword = async (formData: { token: string, password: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message);
    }
};

export const updateUserProfile = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return response.json();
};

export const fetchHotels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/hotels`);
    if (!response.ok) {
      throw new Error("Failed to fetch hotels");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
};

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
}

export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> =>{
    const queryParams = new URLSearchParams();
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>{
        queryParams.append("facilities", facility);
    });

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

    if(!response.ok){
        throw new Error("Error fetching hotels")
    }

    return response.json();
}

export const fetchHotelById = async(hotelID: string): Promise<HotelType> =>{
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelID}`);
    if(!response.ok){
        throw new Error("Error fetching Hotel Details");
    }

    return response.json();
}