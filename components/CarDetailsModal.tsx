
import React, { useState } from 'react';
import type { Car } from '../types';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { CalendarIcon } from './icons/CalendarIcon';
import { LocationIcon } from './icons/LocationIcon';
import { UserIcon } from './icons/UserIcon';

interface CarDetailsModalProps {
    car: Car;
    onClose: () => void;
}

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({ car, onClose }) => {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingMessage, setBookingMessage] = useState('');

    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            const days = (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24);
            if (days > 0) {
                setTotalPrice(days * car.price_per_day);
            } else {
                setTotalPrice(0);
            }
        }
    };
    
    const handleBooking = async () => {
        if (!user) {
            setBookingMessage('You must be logged in to book a car.');
            return;
        }
        if (!startDate || !endDate || totalPrice <= 0) {
            setBookingMessage('Please select valid start and end dates.');
            return;
        }
        
        const { error } = await supabase.from('bookings').insert([{
            car_id: car.id,
            renter_id: user.id,
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
            status: 'confirmed'
        }]);

        if (error) {
            setBookingMessage(`Error booking car: ${error.message}`);
        } else {
            setBookingMessage('Booking successful! Check your dashboard for details.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <div className="grid md:grid-cols-2 gap-0">
                    <div>
                        <img src={car.image_url} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover rounded-l-lg" />
                    </div>
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-white mb-2">{car.make} {car.model}</h2>
                        <p className="text-gray-400 mb-6">{car.year}</p>
                        
                        <p className="text-gray-300 mb-6">{car.description}</p>
                        
                        <div className="space-y-3 text-gray-300 mb-6">
                            <div className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-brand-secondary"/> Owner ID: {car.owner_id.substring(0,8)}...</div>
                            <div className="flex items-center"><LocationIcon className="w-5 h-5 mr-3 text-brand-secondary"/> {car.location}</div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-semibold text-white mb-2">Features</h4>
                            <div className="flex flex-wrap gap-2">
                                {car.features.map(feature => <span key={feature} className="bg-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">{feature}</span>)}
                            </div>
                        </div>
                        
                        <div className="bg-gray-700/50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-white mb-4">Book this car</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                                    <input type="date" id="start-date" value={startDate} onChange={e => handleDateChange(e.target.value, endDate)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white" />
                                </div>
                                <div>
                                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                                    <input type="date" id="end-date" value={endDate} onChange={e => handleDateChange(startDate, e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-300">Total Price:</span>
                                <span className="text-2xl font-bold text-white">₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <button onClick={handleBooking} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 rounded-lg transition-colors">Confirm Booking</button>
                            {bookingMessage && <p className="text-center mt-4 text-sm text-brand-accent">{bookingMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetailsModal;