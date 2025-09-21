
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { CarIcon } from './icons/CarIcon';

interface HeaderProps {
    setView: (view: 'home' | 'dashboard' | 'auth' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
    const { session, signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
    }

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => setView('home')}
                >
                    <CarIcon className="w-8 h-8 text-brand-primary" />
                    <span className="text-2xl font-bold text-white">Self Drive Car</span>
                </div>
                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            <button onClick={() => setView('dashboard')} className="text-gray-300 hover:text-white transition-colors">Dashboard</button>
                            <button onClick={() => setView('profile')} className="text-gray-300 hover:text-white transition-colors">Profile</button>
                            <button 
                                onClick={handleSignOut} 
                                className="bg-brand-secondary hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setView('auth')}
                            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                        >
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;