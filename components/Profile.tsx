
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserIcon } from './icons/UserIcon';

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProfile(true);
        setProfileMessage('');
        setProfileError('');

        const { error } = await updateUser({ fullName });

        if (error) {
            setProfileError(error.message);
        } else {
            setProfileMessage('Profile updated successfully!');
        }
        setLoadingProfile(false);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        setLoadingPassword(true);
        setPasswordMessage('');
        setPasswordError('');

        const { error } = await updateUser({ password });
        
        if (error) {
            setPasswordError(error.message);
        } else {
            setPasswordMessage('Password updated successfully!');
            setPassword(''); // Clear password field
        }
        setLoadingPassword(false);
    };

    if (!user) {
        return <p>Loading user profile...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center space-x-4">
                <div className="bg-gray-700 p-4 rounded-full">
                    <UserIcon className="w-10 h-10 text-brand-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Manage Profile</h1>
                    <p className="text-gray-400">Update your personal information and password.</p>
                </div>
            </div>

            {/* Profile Information Form */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                {profileError && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center">{profileError}</p>}
                {profileMessage && <p className="bg-green-900/50 text-green-300 p-3 rounded-md mb-4 text-center">{profileMessage}</p>}
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loadingProfile}
                            className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-secondary disabled:bg-gray-600"
                        >
                            {loadingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Change Password Form */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
                {passwordError && <p className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-center">{passwordError}</p>}
                {passwordMessage && <p className="bg-green-900/50 text-green-300 p-3 rounded-md mb-4 text-center">{passwordMessage}</p>}
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">New Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter a new password"
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loadingPassword}
                            className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-secondary disabled:bg-gray-600"
                        >
                            {loadingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
