import React, { useRef } from 'react';
import Hero from './Hero';
import CarList from './CarList';

const HomePage: React.FC = () => {
    const carListRef = useRef<HTMLDivElement>(null);

    const handleExploreClick = () => {
        carListRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <Hero onExploreClick={handleExploreClick} />
            <div ref={carListRef} id="car-list-section">
                <CarList />
            </div>
        </div>
    );
};

export default HomePage;