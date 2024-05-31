export type Usertype = {
    _id: string,
    email: string,
    mobile: string,
    password: string,
    firstName: string,
    lastName: string,
    isVerified: boolean,
    isAdmin: boolean,
    isBlocked: boolean,
    resetPasswordToken?: string | null,
    resetPasswordExpires?: Date | null
}

export type HotelType = {
    _id: string;
    userID: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    lastUpdated: Date;
};

export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
        total : number;
        page: number;
        pages: number;
    }
}