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

    const mutation = useMutation({
        mutationFn: (data: UserCredentials) => axios.post(`${API_URL}/user/register`, data),
        onSuccess: () => {
            setMessage('User registered successfully');
            toast.success('User registered successfully');
            setTimeout(() => navigate('/login'), 1500);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Error occurred');
            setMessage(error.response?.data?.message || 'Error occurred');
        },
    });

    const onSubmit = (data: UserCredentials) => mutation.mutate(data);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center ">
                <h2 className="text-4xl font-bold mb-8">Welcome to Our Platform</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6">Sign up</h1>
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
                    {mutation.isPending ? 'Loading...' : 'Sign Up'}
                </button>
                <p className="mt-4 text-center text-gray-600">
                    If you already have an account,&nbsp;
                    <Link
                        to="/login"
                        className="text-blue-500 hover:underline hover:text-blue-700"
                    >
                        go to Login
                    </Link>
                </p>
                {message && <p className="mt-4 text-center">{message}</p>}

            </form>
        </div>
    );
}
