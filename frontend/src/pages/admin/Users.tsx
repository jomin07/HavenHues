import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { UserType } from "../../shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
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
        accessorKey: "firstName",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "subscriptionPlan",
        header: "Subscription Plan",
      },
      {
        accessorKey: "isBlocked",
        header: "Status",
        cell: ({ row }: any) => (row.original.isBlocked ? "Blocked" : "Active"),
      },
      {
        accessorKey: "_id",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="flex justify-center">
            <button
              className={`py-2 rounded ${
                row.original.isBlocked
                  ? "bg-green-600 hover:bg-green-500 px-10 md:px-16"
                  : "bg-red-600 hover:bg-red-500 px-10 md:px-20"
              } text-white`}
              onClick={() => toggleUserStatus(row.original._id)}
            >
              {row.original.isBlocked ? "Unblock" : "Block"}
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
      <div className="py-4 mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
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

export default Users;
