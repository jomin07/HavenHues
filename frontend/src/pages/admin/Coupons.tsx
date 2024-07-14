import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { CouponType } from "../../shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchCoupons = async (page: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/coupons?page=${page}&limit=${itemsPerPage}`
      );
      setCoupons(response.data.coupons);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  useEffect(() => {
    fetchCoupons(currentPage);
  }, [currentPage]);

  const toggleCouponStatus = async (id: string) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/coupons/${id}/toggle-status`
      );
      setCoupons((prevCoupons) =>
        prevCoupons.map((coupon) =>
          coupon._id === id
            ? { ...coupon, status: response.data.coupon.status }
            : coupon
        )
      );
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    }
  };

  const data = useMemo(() => coupons, [coupons]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Code",
      },
      {
        accessorKey: "discount",
        header: "Discount",
        cell: ({ row }: any) => (
          <>
            {row.original.discountType === "number" && "₹"}
            {row.original.discount}
            {row.original.discountType === "percentage" && "%"}
          </>
        ),
      },
      {
        accessorKey: "expiryDate",
        header: "Expiry Date",
        cell: ({ row }: any) =>
          new Date(row.original.expiryDate).toLocaleDateString(),
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "_id",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="flex justify-center">
            <Link
              to={`/admin/coupons/${row.original._id}`}
              className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </Link>
            <button
              className={`${
                row.original.status
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-green-600 hover:bg-green-500"
              } text-white font-bold py-2 px-3 rounded ml-2`}
              onClick={() => toggleCouponStatus(row.original._id)}
            >
              {row.original.status ? "Block" : "Unblock"}
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        setCurrentPage(
          updater({ pageIndex: currentPage - 1, pageSize: itemsPerPage })
            .pageIndex + 1
        );
      } else {
        setCurrentPage(updater.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center py-4 mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Link
          to="/admin/coupons/new"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Create Coupon
        </Link>
      </div>
      <input
        value={table.getState().globalFilter || ""}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="mb-6 p-2 border border-gray-300 rounded"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100 border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`py-3 px-6 text-left ${
                      header.column.id === "_id" ? "text-center" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanSort() && (
                        <button
                          {...{
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                          className="ml-2"
                        >
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "desc" ? (
                              <FaSortDown />
                            ) : (
                              <FaSortUp />
                            )
                          ) : (
                            <FaSort />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 mx-1 opacity-80 bg-black cursor-pointer hover:opacity-70 text-white rounded disabled:opacity-30 disabled:cursor-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <span className="px-4 py-2 mx-1">
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-4 py-2 mx-1 opacity-80 bg-black cursor-pointer hover:opacity-70 text-white rounded disabled:opacity-30 disabled:cursor-none"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupons;
