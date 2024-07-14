import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { FaUser, FaHotel, FaRupeeSign } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TimeRangeSelector = ({
  selectedRange,
  onSelect,
}: {
  selectedRange: any;
  onSelect: (range: any) => void;
}) => {
  const buttonClass = (range: any) =>
    `px-4 py-2 m-2 rounded-lg ${
      selectedRange === range
        ? "bg-blue-500 text-white"
        : "bg-gray-200 text-gray-800"
    }`;

  return (
    <div className="flex justify-center mb-6">
      <button
        className={buttonClass("weekly")}
        onClick={() => onSelect("weekly")}
      >
        Weekly
      </button>
      <button
        className={buttonClass("monthly")}
        onClick={() => onSelect("monthly")}
      >
        Monthly
      </button>
      <button
        className={buttonClass("yearly")}
        onClick={() => onSelect("yearly")}
      >
        Yearly
      </button>
    </div>
  );
};

interface RevenueData {
  date: string;
  amount: number;
}

interface HotelData {
  name: string;
  bookingsCount: number;
}

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [hotelCount, setHotelCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topHotels, setTopHotels] = useState<HotelData[]>([]);
  const [timeRange, setTimeRange] = useState("monthly");

  const fetchData = async (range: any) => {
    try {
      const usersResponse = await axios.get(
        `${API_BASE_URL}/api/admin/users-count`
      );
      const hotelsResponse = await axios.get(
        `${API_BASE_URL}/api/admin/hotels-count`
      );
      const revenueResponse = await axios.get(
        `${API_BASE_URL}/api/admin/revenue?range=${range}`
      );
      const topHotelsResponse = await axios.get(
        `${API_BASE_URL}/api/admin/top-booking-hotels?range=${range}`
      );

      setUserCount(usersResponse.data.count);
      setHotelCount(hotelsResponse.data.count);
      setRevenue(revenueResponse.data.total);
      setRevenueData(revenueResponse.data.data as RevenueData[]);
      setTopHotels(topHotelsResponse.data as HotelData[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const revenueChartData = {
    labels: revenueData.map((data) => data.date),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((data) => data.amount),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Revenue",
      },
    },
  };

  const topHotelsChartData = {
    labels: topHotels.map((hotel) => hotel.name),
    datasets: [
      {
        label: "Bookings",
        data: topHotels.map((hotel) => hotel.bookingsCount),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const topHotelsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top Booking Hotels",
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="py-4 mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-center">
          <FaUser className="h-12 w-12 text-blue-500" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-xl">{userCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-center">
          <FaHotel className="h-12 w-12 text-green-500" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Hotels</h2>
            <p className="text-xl">{hotelCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-center">
          <FaRupeeSign className="h-12 w-12 text-yellow-500" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p className="text-xl">₹{revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <TimeRangeSelector selectedRange={timeRange} onSelect={setTimeRange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={revenueChartData} options={revenueChartOptions} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <Bar data={topHotelsChartData} options={topHotelsChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
