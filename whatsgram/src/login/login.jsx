import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Mail, Lock, ChevronRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const handleInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginData = {
      email: inputData.email,
      username: inputData.username,
      password: inputData.password
    };

    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/login',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const data = response.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
      } else {
        toast.success(data.message);
        localStorage.setItem('chatapp', JSON.stringify(data));
        setLoading(false);
        navigate('/'); // Redirect to home or dashboard
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const goToSignup = () => {
    navigate('/register'); // Navigate to the signup page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">
            Log In to <span className="text-yellow-300">WhatsGram</span>
          </h1>
          <p className="mt-2 text-lg text-white">Access your account and start chatting</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-50 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-purple-300"
                  placeholder="Email address"
                  onChange={handleInput}
                />
              </div>
            </div>
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                <input
                  id="username"
                  type="text"
                  className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-50 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-purple-300"
                  placeholder="Username"
                  onChange={handleInput}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                <input
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-50 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-purple-300"
                  placeholder="Password"
                  onChange={handleInput}
                />
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-purple-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Log In
                  <ChevronRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className='text-sm text-white transition-colors'>
          Don't have an account? 
          </p>
          <button
            onClick={goToSignup}
            className="text-sm text-yellow-300 hover:text-yellow-400 transition-colors"
          >
            Sign up here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
