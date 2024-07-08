import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  subscriptionPlan: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  const fetchUsers = async (page: number) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/users?page=${page}&limit=${itemsPerPage}`
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const toggleUserStatus = async (userId: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}/toggle-status`
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const data = useMemo(() => users, [users]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "firstName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Subscription Plan",
        accessor: "subscriptionPlan",
      },
      {
        Header: "Status",
        accessor: "isBlocked",
        Cell: ({ value }) => (value ? "Blocked" : "Active"),
      },
      {
        Header: "Actions",
        accessor: "_id",
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <div className="flex justify-center">
            <button
              className={`py-2 rounded ${
                row.original.isBlocked
                  ? "bg-green-600 hover:bg-green-500 px-10 md:px-16"
                  : "bg-red-600 hover:bg-red-500 px-10 md:px-20"
              } text-white`}
              onClick={() => toggleUserStatus(value)}
            >
              {row.original.isBlocked ? "Unblock" : "Block"}
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
      <div className="py-4 mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
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

export default Users;
