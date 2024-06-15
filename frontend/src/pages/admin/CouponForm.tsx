import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CouponFormData = {
    name: string;
    description: string;
    startingDate: Date;
    expiryDate: Date;
    minimumAmount: number;
    discount: number;
    discountType: string;
    limit: number;
    maxDiscount?: number;
}

const CouponForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, setError, watch, formState: { errors } } = useForm<CouponFormData>({
        defaultValues: {
            name: '',
            description: '',
            startingDate: new Date(),
            expiryDate: new Date(),
            minimumAmount: 0,
            discount: 0,
            discountType: 'percentage',
            limit: 0
        }
    });

    const startingDate = watch("startingDate");
    const expiryDate = watch("expiryDate");
    const discountType = watch("discountType");

    useEffect(() => {
        if (id) {
            axios.get(`${API_BASE_URL}/api/admin/coupons/${id}`)
                .then(response => {
                    const { name, description, startingDate, expiryDate, minimumAmount, discount, discountType, limit, maxDiscount } = response.data;
                    setValue("name", name);
                    setValue("description", description);
                    setValue("startingDate", new Date(startingDate));
                    setValue("expiryDate", new Date(expiryDate));
                    setValue("minimumAmount", minimumAmount);
                    setValue("discount", discount);
                    setValue("discountType", discountType);
                    setValue("limit", limit);
                    setValue("maxDiscount", maxDiscount);
                })
                .catch(error => console.error(error));
        }
    }, [id, setValue]);

    const onSubmit = (data: CouponFormData) => {
        if (data.discountType === 'percentage' && data.discount > 99) {
            setError("discount", {
                type: "manual",
                message: "Discount percentage cannot exceed 99%",
            });
            return;
        }

        if (id) {
            axios.put(`${API_BASE_URL}/api/admin/coupons/${id}`, data)
                .then(() => navigate('/admin/coupons'))
                .catch(error => console.error(error));
        } else {
            axios.post(`${API_BASE_URL}/api/admin/coupons`, data)
                .then(() => navigate('/admin/coupons'))
                .catch(error => console.error(error));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit Coupon' : 'Create Coupon'}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.name && <span className="text-red-500 text-sm font-bold ">{errors.name.message}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                    {errors.description && <span className="text-red-500 text-sm font-bold">{errors.description.message}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Starting Date</label>
                    <DatePicker
                        selected={startingDate}
                        onChange={(date) => setValue("startingDate", date as Date)}
                        selectsStart
                        startDate={startingDate}
                        endDate={expiryDate}
                        maxDate={expiryDate}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                    <DatePicker
                        selected={expiryDate}
                        onChange={(date) => setValue("expiryDate", date as Date, { shouldValidate: true })}
                        selectsEnd
                        startDate={startingDate}
                        endDate={expiryDate}
                        minDate={startingDate}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.expiryDate && <span className="text-red-500 text-sm font-bold">{errors.expiryDate.message}</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Minimum Amount</label>
                    <input
                        type="number"
                        {...register("minimumAmount", { required: "Minimum amount is required", min: { value: 1, message: "Minimum amount must be greater than 0" } })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.minimumAmount && <span className="text-red-500 text-sm font-bold">{errors.minimumAmount.message}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Discount Type</label>
                    <select
                        {...register("discountType", { required: "Discount type is required" })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="percentage">Percentage</option>
                        <option value="number">Number</option>
                    </select>
                    {errors.discountType && <span className="text-red-500 text-sm font-bold">{errors.discountType.message}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Discount</label>
                    <input
                        type="number"
                        {...register("discount", { required: "Discount is required", min: { value: 1, message: "Discount must be greater than 0" } })}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.discount && <span className="text-red-500 text-sm font-bold">{errors.discount.message}</span>}
                </div>

                {discountType === "percentage" && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Maximum Discount</label>
                        <input
                            type="number"
                            {...register("maxDiscount", { required: "Maximum discount value is required", min: { value: 1, message: "Maximum discount value must be greater than 0" } })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.maxDiscount && <span className="text-red-500 text-sm font-bold">{errors.maxDiscount.message}</span>}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Limit</label>
                    <input
                        type="number"
                        {...register("limit", { required: "Limit is required", min: { value: 1, message: "Limit must be greater than 0" } })}

                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.limit && <span className="text-red-500 text-sm font-bold">{errors.limit.message}</span>}
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {id ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CouponForm;
