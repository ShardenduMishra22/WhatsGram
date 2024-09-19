import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

function Register() {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState(
      {
        fullname: '',
        username: '',
        email: '',
        password: '',
        confpassword: '',
        gender: ''
      }
    );

    const handleChange = (e) => {
        setInputData({
            ...inputData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (inputData.password !== inputData.confpassword) {
            setLoading(false);
            return toast.error("Password and Confirm Password should be the same");
        }
        try {
            const register = await axios.post("/api/auth/register", inputData);
            const data = register.data;
            if (!data.success) {
                setLoading(false);
                toast.error(data.message);
                console.log(data.message);
                return;
            }
            toast.success(data.message);
            localStorage.setItem("chatapp", JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    const selectGender = (gender) => {
        setInputData({
            ...inputData,
            gender,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Register <span className="text-indigo-600">Chatters</span>
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            id="fullname"
                            type="text"
                            onChange={handleChange}
                            value={inputData.fullname}
                            placeholder="Enter Full Name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            onChange={handleChange}
                            value={inputData.username}
                            placeholder="Enter Username"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            onChange={handleChange}
                            value={inputData.email}
                            placeholder="Enter Email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            onChange={handleChange}
                            value={inputData.password}
                            placeholder="Enter Password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            id="confpassword"
                            type="password"
                            onChange={handleChange}
                            value={inputData.confpassword}
                            placeholder="Enter Confirm Password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                checked={inputData.gender === 'male'}
                                onChange={() => selectGender('male')}
                                className="form-radio"
                            />
                            <span className="ml-2 text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                checked={inputData.gender === 'female'}
                                onChange={() => selectGender('female')}
                                className="form-radio"
                            />
                            <span className="ml-2 text-gray-700">Female</span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                            loading ? "bg-gray-500" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                        Login Now!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;