import  { useState, useEffect } from 'react';

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

    useEffect(() => {
        // Fetch users data from an API or database
        const fetchUsers = async () => { 
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/users`);
                console.log('Fetch started');
                
                console.log(response);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const usersData = await response.json();
                console.log(usersData);
                
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

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

    return (
        <div className="overflow-x-auto">
            <table className="w-auto ml-64 bg-white border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 px-24 border-b">Name</th>
                        <th className="py-2 px-24 border-b">Email</th>
                        <th className="py-2 px-24 border-b">Status</th>
                        <th className="py-2 px-24 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td className="py-2 px-24 border-b">{user.firstName}</td>
                            <td className="py-2 px-24 border-b">{user.email}</td>
                            <td className="py-2 px-24 border-b">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                            <td className="py-2 px-24 border-b">
                                <button
                                    className={`py-2 rounded ${user.isBlocked ? 'bg-green-500 px-16' : 'bg-red-500 px-20'} text-white`}
                                    onClick={() => toggleUserStatus(user._id)}
                                >
                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
