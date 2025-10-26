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
            toast.error(error.response?.data?.message || 'Error occurred');
            setMessage(error.response?.data?.message || 'Error occurred');
        },
    });
    const onSubmit = (data: UserCredentials) => mutation.mutate(data);
    return (
        <div className="flex flex-col justify-center items-center h-screen mb-5">
            <div className="flex flex-col justify-center items-center ">
                <h2 className="text-4xl font-bold mb-8">Enter your credentials</h2>
                <h1 className="text-2xl font-bold mb-6">Login</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
                <input {...register('email', { required: 'Email is required' })}
                    placeholder="Email" className="w-full p-2 mb-4 border rounded" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <input type="password" {...register('password', { required: 'Password required', minLength: 3 })}
                    placeholder="Password" className="w-full p-2 mb-4 border rounded" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={`w-full text-white p-2 rounded transition 
                    ${mutation.isPending
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}>
                    {mutation.isPending ? 'Logging...' : 'Login'}
                </button>

                {message && <p className="mt-4 text-center">{message}</p>}
                <p className="mt-4 text-center text-gray-600">
                    If you haven’t an account,&nbsp;
                    <Link
                        to="/signup"
                        className="text-blue-500 hover:underline hover:text-blue-700"
                    >
                        go to Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
