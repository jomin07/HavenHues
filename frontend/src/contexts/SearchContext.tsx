import React, { useContext, useState } from "react";
import { setTime } from "../helpers/user/userHelper";

type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  extraBedCount: number;
  hotelID: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    extraBedCount: number
  ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  const [checkIn, setCheckIn] = useState<Date>(() =>
    setTime(
      new Date(sessionStorage.getItem("checkIn") || new Date().toISOString()),
      15,
      0
    )
  );
  const [checkOut, setCheckOut] = useState<Date>(() =>
    setTime(
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()),
      11,
      0
    )
  );
  const [adultCount, setAdultCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem("adultCount") || "1")
  );
  const [childCount, setChildCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem("childCount") || "0")
  );
  const [extraBedCount, setExtraBedCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem("extraBedCount") || "0")
  );
  const [hotelID, setHotelID] = useState<string>(
    () => sessionStorage.getItem("hotelID") || ""
  );

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    extraBedCount: number,
    hotelID?: string
  ) => {
    const checkInTime = setTime(checkIn, 15, 0);
    const checkOutTime = setTime(checkOut, 11, 0);

    setDestination(destination);
    setCheckIn(checkInTime);
    setCheckOut(checkOutTime);
    setAdultCount(adultCount);
    setChildCount(childCount);
    if (extraBedCount >= 0) {
      setExtraBedCount(extraBedCount);
    }
    if (hotelID) {
      setHotelID(hotelID);
    }

    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("checkIn", checkInTime.toISOString());
    sessionStorage.setItem("checkOut", checkOutTime.toISOString());
    sessionStorage.setItem("adultCount", adultCount.toString());
    sessionStorage.setItem("childCount", childCount.toString());
    if (extraBedCount >= 0) {
      sessionStorage.setItem("extraBedCount", extraBedCount.toString());
    }
    if (hotelID) {
      sessionStorage.setItem("hotelID", hotelID);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        extraBedCount,
        hotelID,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContext;
};
