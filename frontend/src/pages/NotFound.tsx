import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <div className="mb-10">
        <img
          src="/notFound.jpeg"
          alt="Not Found"
          className="w-64 h-64 object-cover"
        />
      </div>
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4 text-blue-500">404</h1>
        <p className="text-3xl mb-8">Oops, Page Not Found!</p>
        <p className="text-base mb-12 text-gray-500">
          Looks like there's a glitch because we couldn't find what you're
          looking for.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Go back to homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
