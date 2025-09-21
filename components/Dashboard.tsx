import React, { useState, useEffect, useRef, FormEvent, DragEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabaseClient';
import type { Car, Booking } from '../types';
import { TagIcon } from './icons/TagIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { XMarkIcon } from './icons/XMarkIcon';

const AddCarForm: React.FC<{ onCarAdded: () => void }> = ({ onCarAdded }) => {
    const { user } = useAuth();
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [price, setPrice] = useState(5000);
    const [location, setLocation] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage('File is too large. Maximum size is 5MB.');
                setMessageType('error');
                return;
            }
            setImageFile(file);
            setMessage('');
            setMessageType(null);
        }
    };
    
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
        setImagePreview(null);
    }, [imageFile]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setMessage('');
        setMessageType(null);

        if (!user) {
            setMessage('You must be logged in.');
            setMessageType('error');
            setLoading(false);
            return;
        }
        if (!imageFile) {
            setMessage('Please select an image for the car.');
            setMessageType('error');
            setLoading(false);
            return;
        }

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('car-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            setMessage(`Error uploading image: ${uploadError.message}`);
            setMessageType('error');
            setLoading(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from('car-images')
            .getPublicUrl(filePath);
        
        const imageUrl = urlData.publicUrl;

        const { error: insertError } = await supabase.from('cars').insert([{
            owner_id: user.id,
            make,
            model,
            year,
            price_per_day: price,
            location,
            availability: true,
            image_url: imageUrl,
            description: 'A newly listed vehicle ready for an adventure.',
            features: ['New Listing', 'GPS Enabled']
        }]);

        if (insertError) {
            setMessage(`Error adding car: ${insertError.message}`);
            setMessageType('error');
        } else {
            setMessage('Car added successfully!');
            setMessageType('success');
            onCarAdded();
            setMake(''); 
            setModel(''); 
            setYear(new Date().getFullYear()); 
            setPrice(5000); 
            setLocation('');
            setImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
        setLoading(false);
    };

    const inputClass = "w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors";

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            <h3 className="text-3xl font-bold mb-6 text-white text-center">List Your Car</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="lg:col-span-2">
                        <h4 className="text-xl font-semibold text-brand-secondary mb-4 border-b border-gray-700 pb-2">Car Details</h4>
                    </div>
                    
                    <div className="relative">
                        <TagIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Make (e.g., Toyota)" value={make} onChange={e => setMake(e.target.value)} required className={inputClass}/>
                    </div>
                    <div className="relative">
                        <TagIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Model (e.g., Camry)" value={model} onChange={e => setModel(e.target.value)} required className={inputClass}/>
                    </div>
                    <div className="relative">
                        <CalendarIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="number" placeholder="Year" value={year} onChange={e => setYear(parseInt(e.target.value))} required className={inputClass}/>
                    </div>
                    <div className="relative">
                        <LocationIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required className={inputClass}/>
                    </div>

                    <div className="lg:col-span-2 mt-4">
                        <h4 className="text-xl font-semibold text-brand-secondary mb-4 border-b border-gray-700 pb-2">Pricing & Image</h4>
                    </div>

                    <div className="relative lg:row-span-2">
                         <CurrencyDollarIcon className="w-5 h-5 absolute top-[1.125rem] left-3 text-gray-400 pointer-events-none" />
                         <input type="number" placeholder="Price per day (in ₹)" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required className={inputClass}/>
                    </div>
                    
                    <div className="lg:row-span-2 h-full min-h-[150px]">
                        <div 
                            className={`flex justify-center items-center w-full h-full rounded-lg border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-brand-primary bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={(e) => handleFileChange(e.target.files)}
                                className="hidden"
                                id="carImage"
                                required={!imageFile}
                            />
                            {imagePreview ? (
                                <div className="relative w-full h-full p-2">
                                    <img src={imagePreview} alt="Car preview" className="w-full h-full object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                                        aria-label="Remove image"
                                    >
                                        <XMarkIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-4 cursor-pointer">
                                    <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-400">
                                        <span className="font-semibold text-brand-secondary">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {message && (
                    <p className={`p-3 rounded-md mt-6 text-center text-sm font-medium ${
                        messageType === 'success' 
                            ? 'bg-green-900/50 text-green-300' 
                            : 'bg-red-900/50 text-red-300'
                    }`}>
                        {message}
                    </p>
                )}
                
                <button type="submit" disabled={loading} className="w-full mt-8 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-lg">
                    {loading ? 'Adding Car...' : 'List My Car Now'}
                </button>
            </form>
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [myCars, setMyCars] = useState<Car[]>([]);
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [listsLoading, setListsLoading] = useState(false);

    const fetchData = async () => {
        if (!user) return;
        setListsLoading(true);
        // Using Promise.all to fetch data in parallel for better performance
        const [carsResponse, bookingsResponse] = await Promise.all([
            supabase.from('cars').select('*').eq('owner_id', user.id),
            supabase.from('bookings').select('*').eq('renter_id', user.id)
        ]);
        
        if (carsResponse.error) console.error('Error fetching cars:', carsResponse.error);
        else setMyCars(carsResponse.data || []);

        if (bookingsResponse.error) console.error('Error fetching bookings:', bookingsResponse.error);
        else setMyBookings(bookingsResponse.data || []);
        
        setListsLoading(false);
        if (initialLoading) {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    if (initialLoading) return <p>Loading dashboard...</p>;

    return (
        <div className="space-y-12">
            <h1 className="text-4xl font-bold">Welcome, {user?.user_metadata?.full_name || user?.email}</h1>
            
            <AddCarForm onCarAdded={fetchData} />

            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold mb-4">My Cars for Rent</h2>
                    {listsLoading ? <p className="text-gray-400">Refreshing list...</p> : myCars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myCars.map(car => (
                                <div key={car.id} className="bg-gray-800 p-4 rounded-lg">
                                    <img src={car.image_url} alt={car.model} className="w-full h-40 object-cover rounded-md mb-2"/>
                                    <h4 className="font-bold text-lg">{car.make} {car.model}</h4>
                                    <p>₹{car.price_per_day}/day</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-400">You haven't listed any cars yet.</p>}
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-4">My Bookings</h2>
                    {listsLoading ? <p className="text-gray-400">Refreshing list...</p> : myBookings.length > 0 ? (
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Car ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Dates</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {myBookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{booking.car_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{booking.start_date} to {booking.end_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">₹{booking.total_price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">{booking.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-400">You have no bookings.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;