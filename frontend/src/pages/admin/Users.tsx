import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isBlocked: boolean; 
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/users?page=${currentPage}&limit=${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data.users);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [currentPage]);

    const toggleUserStatus = async (userId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to toggle user status');
            }
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId
                        ? { ...user, isBlocked: !user.isBlocked }
                        : user
                )
            );
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold my-6 mb-10">Users</h1>
                <table className="w-auto bg-white border-collapse">
                    <thead>
                        <tr>
                            <th className="py-2 px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24 border-b ">Name</th>
                            <th className="py-2 px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24 border-b">Email</th>
                            <th className="py-2 px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24 border-b">Status</th>
                            <th className="py-2 px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="py-2 px-2 sm:px-4 md:px-6 lg:px-8 border-b">{user.firstName}</td>
                                <td className="py-2 px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24 border-b">{user.email}</td>
                                <td className="py-2 px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24 border-b">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                                <td className="py-2 px-2 sm:px-4 md:px-6 lg:px-16 xl:px-24 border-b">
                                    <button
                                        className={`py-2 rounded ${user.isBlocked ? 'bg-green-600 hover:bg-green-500 px-10 md:px-16' : 'bg-red-600 hover:bg-red-500 px-10 md:px-20'} text-white`}
                                        onClick={() => toggleUserStatus(user._id)}
                                    >
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 mx-1 bg-gray-200 rounded"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 mx-1">{currentPage} / {totalPages}</span>
                    <button
                        className="px-4 py-2 mx-1 bg-gray-200 rounded"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Users;
