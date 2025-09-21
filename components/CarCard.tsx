
import React from 'react';
import type { Car } from '../types';
import { useAuth } from '../hooks/useAuth';
import { LocationIcon } from './icons/LocationIcon';
import { StarIcon } from './icons/StarIcon';

interface CarCardProps {
    car: Car;
    onSelectCar: (car: Car) => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onSelectCar }) => {
    const { session, setView } = useAuth();

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-brand-primary/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <img className="w-full h-56 object-cover" src={car.image_url} alt={`${car.make} ${car.model}`} />
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-2xl text-white">{car.make} {car.model}</h3>
                        <p className="text-gray-400 text-sm">{car.year}</p>
                    </div>
                    <div className="flex items-center bg-gray-700 px-2 py-1 rounded-full">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1"/>
                        <span className="text-white font-semibold text-sm">4.8</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-300 mt-4">
                    <LocationIcon className="w-5 h-5 mr-2 text-brand-secondary" />
                    <span>{car.location}</span>
                </div>

                <div className="mt-auto pt-6 flex justify-between items-center">
                    <p className="text-xl font-semibold text-white">
                        ₹{car.price_per_day}
                        <span className="text-sm font-normal text-gray-400">/day</span>
                    </p>
                    {session ? (
                        <button 
                            onClick={() => onSelectCar(car)}
                            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
                        >
                            Details
                        </button>
                    ) : (
                        <button 
                            onClick={() => setView('auth')}
                            className="bg-brand-accent hover:bg-amber-500 text-white font-bold py-2 px-5 rounded-lg transition-transform transform hover:scale-105"
                        >
                            Login to Book
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarCard;