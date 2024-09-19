import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, ChevronRight } from 'lucide-react';

const FormField = ({ id, type, placeholder, icon: Icon, value, onChange }) => (
  <div>
    <label htmlFor={id} className="sr-only">{placeholder}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
      <input
        id={id}
        type={type}
        required
        className="w-full pl-10 pr-3 py-2 bg-white bg-opacity-50 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-purple-300"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const GenderCheckbox = ({ gender, selectedGender, onChange, label }) => (
  <label className="inline-flex items-center">
    <input
      type="checkbox"
      className="form-checkbox text-yellow-400 border-2 border-purple-300 rounded focus:ring-yellow-400"
      checked={selectedGender === gender}
      onChange={() => onChange(gender)}
    />
    <span className="ml-2 text-white">{label}</span>
  </label>
);

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confpassword: '',
    gender: ''
  });

  const handleInput = (e) => {
    const { id, value } = e.target;
    setInputData(prev => ({ ...prev, [id]: value }));
  };

  const selectGender = (selectedGender) => {
    setInputData(prev => ({ ...prev, gender: selectedGender === prev.gender ? '' : selectedGender }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (inputData.password !== inputData.confpassword) {
      setLoading(false);
      return toast.error("Passwords don't match");
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/register',
        inputData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      toast.success('User created successfully!');
      localStorage.setItem('chatapp', JSON.stringify(data));
      setAuthUser(data);
      const ld = await setTimeout(() => {
        setLoading(true);
      }, 5000);
    }finally {
        navigate('/login');
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">
            Join <span className="text-yellow-300">WhatsGram</span>
          </h1>
          <p className="mt-2 text-lg text-white">Create your account and start chatting</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormField id="fullname" type="text" placeholder="Full Name" icon={UserPlus} value={inputData.fullname} onChange={handleInput} />
            <FormField id="username" type="text" placeholder="Username" icon={User} value={inputData.username} onChange={handleInput} />
            <FormField id="email" type="email" placeholder="Email address" icon={Mail} value={inputData.email} onChange={handleInput} />
            <FormField id="password" type="password" placeholder="Password" icon={Lock} value={inputData.password} onChange={handleInput} />
            <FormField id="confpassword" type="password" placeholder="Confirm Password" icon={Lock} value={inputData.confpassword} onChange={handleInput} />
            <div className="flex justify-center space-x-4">
              <GenderCheckbox gender="male" selectedGender={inputData.gender} onChange={selectGender} label="Male" />
              <GenderCheckbox gender="female" selectedGender={inputData.gender} onChange={selectGender} label="Female" />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-purple-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  Registering...
                  <ChevronRight className="ml-2 -mr-1 h-5 w-5 animate-spin" aria-hidden="true" />
                </>
              ) : (
                <>
                  Register
                  <ChevronRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-white">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-yellow-300 hover:text-yellow-200 underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
