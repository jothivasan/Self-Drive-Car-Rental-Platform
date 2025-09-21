
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
// FIX: The `useAuth` hook is defined in `hooks/useAuth.ts`, not `context/AuthContext.tsx`.
// The import path has been corrected.
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

const AppContent: React.FC = () => {
    const { session, view, setView } = useAuth();

    const renderView = () => {
        if (view === 'auth' && !session) {
            return <AuthForm />;
        }
        
        switch (view) {
            case 'home':
                return <HomePage />;
            case 'dashboard':
                return session ? <Dashboard /> : <AuthForm />;
            case 'profile':
                return session ? <Profile /> : <AuthForm />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            <Header setView={setView} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;