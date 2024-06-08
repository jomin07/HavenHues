import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CouponType } from "../../../../backend/src/shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Coupons = () => {
    const [coupons, setCoupons] = useState<CouponType[]>([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/admin/coupons`)
            .then(response => setCoupons(response.data))
            .catch(error => console.error(error));
    }, []);

    const toggleCouponStatus = async (id: string) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/coupons/${id}/toggle-status`);
            setCoupons(coupons.map(coupon => 
                coupon._id === id ? { ...coupon, status: response.data.coupon.status } : coupon
            ));
        } catch (error) {
            console.error('Error toggling coupon status:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center py-4 mb-6">
                <h1 className="text-3xl font-bold">Coupons</h1>
                <Link to="/admin/coupons/new" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                    Create Coupon
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-3 px-6 text-left">Code</th>
                            <th className="py-3 px-6 text-left">Discount</th>
                            <th className="py-3 px-6 text-left">Expiry Date</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-6">{coupon.name}</td>
                                <td className="py-3 px-6">
                                    {coupon.discountType === "number" && "₹"}
                                    {coupon.discount} 
                                    {coupon.discountType === "percentage" && "%"}
                                </td>
                                <td className="py-3 px-6">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                <td className="py-3 px-6">{coupon.description}</td>
                                <td className="py-3 px-6">
                                    <div className="flex space-x-2">
                                        <Link to={`/admin/coupons/${coupon._id}`} className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded">
                                            Edit
                                        </Link>
                                        <button
                                            className={`${
                                                coupon.status ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
                                            } text-white font-bold py-2 px-3 rounded`}
                                            onClick={() => toggleCouponStatus(coupon._id)}
                                        >
                                            {coupon.status ? 'Block' : 'Unblock'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Coupons;
