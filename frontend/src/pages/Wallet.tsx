import axios from 'axios';
import { WalletHistoryType } from '../../../backend/src/shared/types';
import { useQuery } from 'react-query';

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

    if (isLoading) {
        return <div>Loading...</div>;
      }
    
    if (error) {
    return <div>Error fetching wallet data</div>;
    }

    return (
        <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Wallet</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="block text-lg mb-1">Wallet Balance:</label>
                <p className="w-full border rounded-lg p-2">{data?.wallet}</p>
              </div>
              <div className="mb-4">
                <label className="block text-lg mb-1">Wallet History:</label>
                <ul className="w-full border rounded-lg p-2">
                  {data?.walletHistory.map((entry, index) => (
                    <li key={index} className="border-b py-2">
                      {new Date(entry.date).toLocaleDateString()}: {entry.amount} - {entry.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
    );
};

export default Wallet;
