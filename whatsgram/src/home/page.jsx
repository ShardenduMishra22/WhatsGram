import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-8">Welcome to Our App</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Experience the next level of productivity and collaboration with our cutting-edge platform.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/signin')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Home;