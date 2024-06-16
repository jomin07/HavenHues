import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Booking {
  _id: string;
  firstName: string;
  totalCost: number;
  checkIn: string;
  checkOut: string;
  status: string;
}

const Bookings: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      axios.get(`${API_BASE_URL}/api/admin/bookings`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      })
      .then(response => {
        const filteredBookings = response.data.filter(
          (booking: Booking) => booking.status !== "Pending" && booking.status !== "Cancelled"
        );
        setBookings(filteredBookings);
        const revenue = filteredBookings.reduce((sum: number, booking: Booking) => sum + booking.totalCost, 0);
        setTotalRevenue(revenue);
      })
      .catch(error => {
        console.error('There was an error fetching the bookings!', error);
      });
    }
  }, [startDate, endDate]);

  const exportToCSV = () => {
    const headers = [
      { label: "Booking ID", key: "_id" },
      { label: "User", key: "firstName" },
      { label: "Total Cost", key: "totalCost" },
      { label: "Check-In", key: "checkIn" },
      { label: "Check-Out", key: "checkOut" },
      { label: "Status", key: "status" },
    ];
    const data = bookings.map(booking => ({
      _id: booking._id,
      firstName: booking.firstName,
      totalCost: booking.totalCost,
      checkIn: new Date(booking.checkIn).toLocaleDateString(),
      checkOut: new Date(booking.checkOut).toLocaleDateString(),
      status: booking.status,
    }));
    const csvReport = {
      data,
      headers,
      filename: 'Bookings_Report.csv'
    };
    return csvReport;
  };

  const exportToExcel = () => {
    const data = bookings.map(booking => ({
      BookingID: booking._id,
      User: booking.firstName,
      TotalCost: booking.totalCost,
      CheckIn: new Date(booking.checkIn).toLocaleDateString(),
      CheckOut: new Date(booking.checkOut).toLocaleDateString(),
      Status: booking.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, 'Bookings_Report.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const dateRangeText = `Bookings from ${startDate ? startDate.toLocaleDateString() : ''} to ${endDate ? endDate.toLocaleDateString() : ''}`;
    
    // Add a heading with the date range
    doc.text(dateRangeText, 10, 10);
  
    // Add the table
    autoTable(doc, {
      startY: 20, // Starting after the heading
      head: [['Booking ID', 'User', 'Total Cost', 'Check-In', 'Check-Out', 'Status']],
      body: bookings.map(booking => [
        booking._id,
        booking.firstName,
        booking.totalCost,
        new Date(booking.checkIn).toLocaleDateString(),
        new Date(booking.checkOut).toLocaleDateString(),
        booking.status,
      ]),
    });
  
    // Get the final Y position of the table
    const finalY = doc.lastAutoTable.finalY || 20;
  
    // Add the total revenue below the table
    doc.text(`Total Revenue: Rs.${totalRevenue}`, 10, finalY + 10);
  
    // Save the PDF
    doc.save('Bookings_Report.pdf');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Bookings</h1>
      <div className='flex justify-between'>
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border p-2 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              className="border p-2 rounded"
            />
          </div>
        </div>
        <div className="relative inline-block text-left mb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            Export
          </button>
          {isDropdownOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabIndex={-1}
            >
              <div className="py-1" role="none">
                <button
                  onClick={exportToExcel}
                  className="text-gray-700 block px-4 py-2 text-sm w-full text-left"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-0"
                >
                  Export to Excel
                </button>
                <CSVLink {...exportToCSV()} className="text-gray-700 block px-4 py-2 text-sm w-full text-left" role="menuitem" tabIndex={-1} id="menu-item-1">
                  Export to CSV
                </CSVLink>
                <button
                  onClick={exportToPDF}
                  className="text-gray-700 block px-4 py-2 text-sm w-full text-left"
                  role="menuitem"
                  tabIndex={-1}
                  id="menu-item-2"
                >
                  Export to PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {startDate && endDate && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">
            Bookings from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </h2>
          <h4 className="text-lg font-medium">Total Revenue: ₹{totalRevenue}</h4>
        </div>
      )}
      <div className="bg-white shadow-md rounded p-4">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Booking ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Cost</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-In</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-Out</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">{booking._id}</td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">{booking.firstName}</td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">{booking.totalCost}</td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">{new Date(booking.checkOut).toLocaleDateString()}</td>
                <td className="px-5 py-3 border-b border-gray-200 bg-white text-sm">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
