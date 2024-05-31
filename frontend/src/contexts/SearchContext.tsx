import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelID: string;
    saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
    ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
    children: React.ReactNode;
}

export const SearchContextProvider = ({ children }: SearchContextProviderProps) =>{
    const [destination, setDestination] = useState<string>("");
    const [checkIn,setCheckIn] = useState<Date>(new Date());
    const [checkOut,setCheckOut] = useState<Date>(new Date());
    const [adultCount,setAdultCount] = useState<number>(1);
    const [childCount,setChildCount] = useState<number>(0);
    const [hotelID,setHotelID] = useState<string>("");

    const saveSearchValues = (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        hotelID?: string
    ) => {
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setAdultCount(adultCount);
        setChildCount(childCount);
        if(hotelID){
            setHotelID(hotelID);
        }
    };

    return(
        <SearchContext.Provider
            value={{
                destination,
                checkIn,
                checkOut,
                adultCount,
                childCount,
                hotelID,
                saveSearchValues
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export const useSearchContext = () =>{
    const context = useContext(SearchContext);
    return context as SearchContext;
}