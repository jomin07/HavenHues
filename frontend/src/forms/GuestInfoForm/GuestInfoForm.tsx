import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect } from "react";
import { fetchBookedDates } from "../../api-client";
import { useQuery } from "react-query";
import Loader from "../../components/Loader";

type Props = {
  hotelID: string;
  pricePerNight: number;
  extraBedCount: number;
  extraBedCharge: number;
  maxAdultCount: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  extraBedCount: number;
};

const GuestInfoForm = ({
  hotelID,
  pricePerNight,
  extraBedCount,
  extraBedCharge,
  maxAdultCount,
}: Props) => {
  const { data: bookedDates, isLoading: datesLoading } = useQuery(
    ["fetchBookedDates", hotelID],
    () => fetchBookedDates(hotelID),
    {
      enabled: !!hotelID,
    }
  );
  const search = useSearchContext();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
      extraBedCount: 0,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const currentExtraBedCount = watch("extraBedCount");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  useEffect(() => {
    if (checkOut > checkIn) {
      clearErrors("checkOut");
    }
  }, [checkIn, checkOut, clearErrors]);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
      data.extraBedCount
    );
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    if (data.adultCount > maxAdultCount + data.extraBedCount) {
      setError("adultCount", {
        type: "manual",
        message: `Total adults should not exceed ${
          maxAdultCount + data.extraBedCount
        }`,
      });
      return;
    }

    if (data.checkOut <= data.checkIn) {
      setError("checkOut", {
        type: "manual",
        message: "Check-out date must be later than check-in date",
      });
      return;
    }

    if (
      isOverlappingWithBookedDates(
        data.checkIn,
        data.checkOut,
        bookedDateRanges
      )
    ) {
      setError("checkOut", {
        type: "manual",
        message: "Selected dates overlap with unavailable days",
      });
      return;
    }

    clearErrors("adultCount");
    clearErrors("checkOut");
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount,
      data.extraBedCount
    );
    navigate(`/hotel/${hotelID}/booking`);
  };

  if (datesLoading) {
    return <Loader loading={true} />;
  }

  const generateDateRange = (startDate: Date, endDate: Date) => {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const bookedDateRanges = bookedDates.flatMap(
    (date: { checkIn: string; checkOut: string }) =>
      generateDateRange(new Date(date.checkIn), new Date(date.checkOut))
  );

  const isOverlappingWithBookedDates = (
    checkIn: Date,
    checkOut: Date,
    bookedDateRanges: Date[]
  ) => {
    return bookedDateRanges.some(
      (bookedDate) => checkIn <= bookedDate && bookedDate <= checkOut
    );
  };

  console.log("Booked Date Ranges: ", bookedDateRanges);

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">Price Per Night: ₹{pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              excludeDates={bookedDateRanges}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              excludeDates={bookedDateRanges}
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />

            {errors.checkOut && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.checkOut.message}
              </span>
            )}
          </div>

          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Adults:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be atleast one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="items-center flex">
              Children:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={0}
                max={5}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>

          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Extra Beds:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={0}
                max={extraBedCount}
                {...register("extraBedCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
          </div>

          {currentExtraBedCount > 0 && (
            <div className="text-blue-600 font-semibold">
              Extra Bed Charges: ₹{currentExtraBedCount * extraBedCharge}
            </div>
          )}
          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign In to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
