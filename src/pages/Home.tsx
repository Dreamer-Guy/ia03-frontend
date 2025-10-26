import { useLocation,useNavigate } from 'react-router-dom';
import type { User } from '../types/user';

const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user: User = location.state?.user;
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <h1 className="text-4xl font-bold mb-4">Please go to login first</h1>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:cursor-pointer hover:bg-blue-50 transition-all duration-200"
                >
                    Go to Login
                </button>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to My App</h1>
            <p className="text-lg opacity-90 mb-8 text-center max-w-md">
                This is a simple homepage built with <span className="font-semibold">React + TailwindCSS</span>.
            </p>

            {user ? (
                <div className="bg-white text-blue-700 rounded-xl shadow-lg p-6 mb-6 text-center w-80">
                    <h2 className="text-xl font-bold mb-2">User Information</h2>
                    <p><span className="font-semibold">Email:</span> {user.email}</p>
                    <p>
                        <span className="font-semibold">Created At:</span>{' '}
                        {new Date(user.createdAt).toLocaleString()}
                    </p>
                </div>
            ) : (
                <p className="text-red-200 mb-6">No user data found. Please login first.</p>
            )}

        </div>
    );
};

export default HomePage;
