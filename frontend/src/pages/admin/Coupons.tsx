import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CouponType } from "../../../../backend/src/shared/types";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Coupons = () => {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = (page: number) => {
    axios
      .get(
        `${API_BASE_URL}/api/admin/coupons?page=${page}&limit=${itemsPerPage}`
      )
      .then((response) => {
        setCoupons(response.data.coupons);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const toggleCouponStatus = async (id: string) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/coupons/${id}/toggle-status`
      );
      setCoupons(
        coupons.map((coupon) =>
          coupon._id === id
            ? { ...coupon, status: response.data.coupon.status }
            : coupon
        )
      );

      fetchData(currentPage);
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    }
  };

  const data = useMemo(() => coupons, [coupons]);

  const columns = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "name",
      },
      {
        Header: "Discount",
        accessor: "discount",
        Cell: ({ value, row }) => (
          <>
            {row.original.discountType === "number" && "₹"}
            {value}
            {row.original.discountType === "percentage" && "%"}
          </>
        ),
      },
      {
        Header: "Expiry Date",
        accessor: "expiryDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Actions",
        accessor: "_id",
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <div className="flex justify-center">
            <Link
              to={`/admin/coupons/${value}`}
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
              onClick={() => toggleCouponStatus(value)}
            >
              {row.original.status ? "Block" : "Unblock"}
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPage - 1, pageSize: itemsPerPage },
      manualPagination: true,
      pageCount: totalPages,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

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
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="mb-6 p-2 border border-gray-300 rounded"
      />
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full bg-white border border-gray-200 rounded-md shadow-md"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className="bg-gray-100 border-b"
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`py-3 px-6 text-left ${
                      column.Header === "Actions" ? "text-center" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {column.render("Header")}
                      {column.Header !== "Actions" &&
                        (column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaSortDown className="ml-2" />
                          ) : (
                            <FaSortUp className="ml-2" />
                          )
                        ) : (
                          <FaSort className="ml-2" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="border-b hover:bg-gray-50"
                >
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="py-3 px-6">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 mx-1 opacity-80 bg-black cursor-pointer hover:opacity-70 text-white rounded disabled:opacity-30 disabled:cursor-none"
            onClick={() => {
              previousPage();
              setCurrentPage(pageIndex);
            }}
            disabled={!canPreviousPage}
          >
            Prev
          </button>
          <span className="px-4 py-2 mx-1">
            {pageIndex + 1} / {totalPages}
          </span>
          <button
            className="px-4 py-2 mx-1 opacity-80 bg-black cursor-pointer hover:opacity-70 text-white rounded disabled:opacity-30 disabled:cursor-none"
            onClick={() => {
              nextPage();
              setCurrentPage(pageIndex + 2);
            }}
            disabled={!canNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupons;
