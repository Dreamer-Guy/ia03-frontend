import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserCredentials } from '../types/user';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { register, handleSubmit, formState: { errors } } = useForm<UserCredentials>();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const mutation = useMutation({
        mutationFn: (data: UserCredentials) => axios.post(`${API_URL}/user/login`, data),
        onSuccess: (res) => {
            setMessage('User logged in successfully');
            toast.success('User logged in successfully');
            setTimeout(() => navigate('/', {
                state: {
                    user: {
                        id: res.data._id,
                        email: res.data.email,
                        createdAt: res.data.createdAt
                    }
                }
            }), 2000);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Can not make API Call to server ');
            setMessageType('error');
            setMessage(error.response?.data?.message || 'Can not make API Call to server ');
        },
    });
    const onSubmit = (data: UserCredentials) => mutation.mutate(data);
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-purple-100 via-white to-blue-100 p-4">
            <div className="text-center mb-8">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-800 drop-shadow-md">
                    Enter your credentials
                </h2>
                <h1 className="text-3xl font-semibold text-gray-600">Login</h1>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md"
            >
                <div className="mb-4">
                    <input
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                    {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        {...register('password', { required: 'Password required', minLength: 3 })}
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    />
                    {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={`w-full p-3 rounded-lg text-white font-semibold transition 
          ${mutation.isPending
                            ? 'bg-purple-300 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 active:scale-95 shadow-md'
                        }`}
                >
                    {mutation.isPending ? 'Logging...' : 'Login'}
                </button>

                {message && (
                    <p
                        className={`mt-4 text-center font-medium ${messageType === 'success' ? 'text-green-500' : 'text-red-500'
                            }`}>
                        {message}
                    </p>
                )}

                <p className="mt-6 text-center text-gray-500 text-sm">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-purple-500 hover:underline hover:text-purple-700 font-medium">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
