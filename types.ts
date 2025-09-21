
export interface User {
    id: string;
    // FIX: Made email optional to match the Supabase User type, resolving type errors.
    email?: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
        [key: string]: any;
    };
}

export interface Session {
    user: User;
    access_token: string;
    // Note: The real Supabase Session object has more properties.
    // Add them here if needed by the application.
}

export interface Car {
    id: number;
    owner_id: string;
    make: string;
    model: string;
    year: number;
    price_per_day: number;
    location: string;
    availability: boolean;
    image_url: string;
    description: string;
    features: string[];
}

export interface Booking {
    id: number;
    car_id: number;
    renter_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'confirmed' | 'pending' | 'cancelled';
}

export interface SupabaseResponse<T> {
    data: T | null;
    error: Error | null;
}