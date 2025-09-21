
import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase, supabaseUrl, supabaseServiceRoleKey } from '../services/supabaseClient';
import type { Session, User } from '../types';

type View = 'home' | 'dashboard' | 'auth' | 'profile';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    view: View;
    setView: (view: View) => void;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (fullName: string, email: string, password: string) => Promise<any>;
    signOut: () => void;
    updateUser: (details: { fullName?: string; password?: string }) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<View>('home');

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };
        
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        // When user logs in while on the auth page, redirect to the dashboard.
        if (session && view === 'auth') {
            setView('dashboard');
        }
    }, [session, view]);

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.session) {
            setSession(data.session);
            setUser(data.session.user);
        }
        return { data, error };
    };

    const signUp = async (fullName: string, email: string, password: string) => {
        // Step 1: Standard user signup. This creates the user but may leave them unconfirmed.
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (signUpError) return { data: null, error: signUpError };
        if (!signUpData.user) return { data: null, error: new Error('Signup did not return a user.') };

        // --- DANGER ZONE ---
        // The following code uses a service role key on the client-side to auto-confirm a user.
        // This is a MAJOR SECURITY RISK and should NEVER be done in a production application.
        // The service role key grants full administrative access to your Supabase project.
        // This implementation is for demonstration or internal tooling purposes ONLY.
        // The RECOMMENDED and SECURE way to achieve auto-confirmation is to disable the
        // "Confirm email" setting in your Supabase project's Authentication providers.
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

        // Step 2: Use the admin client to mark the user's email as confirmed.
        const { error: adminUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
            signUpData.user.id,
            { email_confirm: true }
        );

        if (adminUpdateError) {
            console.error("Admin user confirmation failed:", adminUpdateError);
            return { data: null, error: new Error('User created, but auto-confirmation failed. Please check your email.') };
        }
        // --- END DANGER ZONE ---

        // Step 3: Sign in the now-confirmed user to get a session.
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (signInError) return { data: null, error: signInError };

        if (signInData.session) {
            setSession(signInData.session);
            setUser(signInData.session.user);
        }
        
        return { data: signInData, error: null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setView('home');
    };

    const updateUser = async (details: { fullName?: string; password?: string }) => {
        const updateData: { password?: string; data?: { [key: string]: any } } = {};
    
        if (details.password) {
            updateData.password = details.password;
        }
    
        if (details.fullName) {
            updateData.data = { full_name: details.fullName };
        }
    
        const { data, error } = await supabase.auth.updateUser(updateData);
    
        if (!error && data.user) {
            // The onAuthStateChange listener should pick up the change,
            // but we can manually update state to ensure the UI updates instantly.
            setUser(data.user);
            const { data: { session: newSession } } = await supabase.auth.getSession();
            setSession(newSession);
        }
        
        return { data, error };
    };

    const value = {
        session,
        user,
        view,
        setView,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};