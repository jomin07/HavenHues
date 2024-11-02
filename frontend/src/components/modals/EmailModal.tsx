import { FaCopy, FaTimes } from "react-icons/fa";

interface EmailModalProps {
  email: string;
  onClose: () => void;
  onCopy: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ email, onClose, onCopy }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="text-xl font-semibold mb-4">Manager Email</h3>
        <p className="text-lg font-medium text-gray-700 mb-4">{email}</p>
        <button
          className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center justify-center w-full hover:bg-blue-500"
          onClick={onCopy}
        >
          Copy Email ID <FaCopy className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default EmailModal;
