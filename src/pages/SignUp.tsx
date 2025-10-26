import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { UserCredentials } from '../types/user';
import toast from 'react-hot-toast';

export default function SignUp() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { register, handleSubmit, formState: { errors } } = useForm<UserCredentials>();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    const mutation = useMutation({
        mutationFn: (data: UserCredentials) => axios.post(`${API_URL}/user/register`, data),
        onSuccess: () => {
            setMessage('User registered successfully');
            toast.success('User registered successfully');
            setTimeout(() => navigate('/login'), 1500);
        },
        onError: (error: any) => {
            setMessageType('error');
            toast.error(error.response?.data?.message || 'Can not make API Call to server ');
            setMessage(error.response?.data?.message || 'Can not make API Call to server ');
        },
    });

    const onSubmit = (data: UserCredentials) => mutation.mutate(data);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-white to-pink-100 p-4">
            <div className="text-center mb-8">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-800 drop-shadow-md">Welcome to Our Platform</h2>
                <h1 className="text-3xl font-semibold text-gray-600">Sign Up</h1>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md"
            >
                <div className="mb-4">
                    <input
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        {...register('password', { required: 'Password required', minLength: 3 })}
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={`w-full p-3 rounded-lg text-white font-semibold transition 
          ${mutation.isPending
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 active:scale-95 shadow-md'
                        }`}
                >
                    {mutation.isPending ? 'Loading...' : 'Sign Up'}
                </button>

                <p className="mt-6 text-center text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline hover:text-blue-700 font-medium">
                        Log in
                    </Link>
                </p>

                {message && (
                    <p
                        className={`mt-4 text-center font-medium ${messageType === 'success' ? 'text-green-500' : 'text-red-500'
                            }`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
