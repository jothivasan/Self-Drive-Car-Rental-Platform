import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Car } from '../types';
import CarCard from './CarCard';
import CarDetailsModal from './CarDetailsModal';
import FilterSort from './FilterSort';

const CarList: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]); // Master list of available cars
    const [filteredCars, setFilteredCars] = useState<Car[]>([]); // List to be displayed
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('cars').select('*');
            if (error) {
                setError(error.message);
            } else {
                // Pre-filter for available cars on initial fetch
                const availableCars = data?.filter(c => c.availability) || [];
                setCars(availableCars);
                setFilteredCars(availableCars);
            }
            setLoading(false);
        };
        fetchCars();
    }, []);

    // Effect to apply filters and sorting whenever dependencies change
    useEffect(() => {
        let processedCars = [...cars];

        // Apply search filter
        if (searchTerm) {
            processedCars = processedCars.filter(car => 
                car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        if (sortOption === 'price-asc') {
            processedCars.sort((a, b) => a.price_per_day - b.price_per_day);
        } else if (sortOption === 'price-desc') {
            processedCars.sort((a, b) => b.price_per_day - a.price_per_day);
        }

        setFilteredCars(processedCars);

    }, [searchTerm, sortOption, cars]);

    if (loading) {
        return <div className="text-center p-8">Loading cars...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-400">Error: {error}</div>;
    }

    return (
        <section>
            <FilterSort 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortOption={sortOption}
                setSortOption={setSortOption}
            />
            {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars.map(car => (
                        <CarCard key={car.id} car={car} onSelectCar={setSelectedCar} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
                    <h3 className="text-2xl font-bold text-white mb-2">No Cars Found</h3>
                    <p className="text-gray-400">Try adjusting your search or filter settings to find what you're looking for.</p>
                </div>
            )}
            {selectedCar && (
                <CarDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} />
            )}
        </section>
    );
};

export default CarList;