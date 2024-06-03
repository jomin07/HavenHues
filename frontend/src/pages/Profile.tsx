import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/update`, user, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error fetching profile</div>;
  }

  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg mb-1">Email:</label>
              <input type="email" name="email" value={user.email} onChange={handleInputChange} className="w-full border rounded-lg p-2" readOnly />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-1">First Name:</label>
              <input type="text" name="firstName" value={user.firstName} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-1">Last Name:</label>
              <input type="text" name="lastName" value={user.lastName} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-1">Mobile:</label>
              <input type="text" name="mobile" value={user.mobile} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
