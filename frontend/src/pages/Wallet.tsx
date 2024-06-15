import axios from 'axios';
import { WalletHistoryType } from '../../../backend/src/shared/types';
import { useQuery } from 'react-query';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type WalletData = {
  wallet: number;
  walletHistory: WalletHistoryType[];
};

const fetchWalletData = async (): Promise<WalletData> => {
  const response = await axios.get(`${API_BASE_URL}/api/users/wallet`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const Wallet = () => {
  const { data, error, isLoading } = useQuery('wallet', fetchWalletData);

  if(isLoading){
    return(
        <Loader loading={isLoading}/>
    );
  }

  if (error) {
    return <div>Error fetching wallet data</div>;
  }

  return (
    <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold mb-4">My Wallet</h2>
            <Link to="/profile" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded">
                Go to Profile
            </Link>
        </div>
        
        <div className="mb-8">
          <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 text-center">
            <label className="block text-2xl mb-2">Wallet Balance</label>
            <p className="text-4xl font-bold">₹{data?.wallet.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Wallet History</h3>
          <ul className="w-full border rounded-lg p-2 max-h-96 overflow-y-auto">
            {data?.walletHistory.map((entry, index) => (
              <li key={index} className="border-b py-2 flex justify-between">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span 
                  className={`${entry.amount > 0 ? 'text-green-500' : 'text-red-500'}         font-bold`}>
                  {entry.amount > 0 ? `+₹${entry.amount.toFixed(2)}` : `-₹${entry.amount.toFixed(2)}`}
                </span>
                <span>{entry.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
