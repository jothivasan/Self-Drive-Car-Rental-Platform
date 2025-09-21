import React from 'react';

interface HeroProps {
    onExploreClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
    return (
        <div className="relative rounded-xl overflow-hidden text-center py-20 px-4 mb-12 bg-gray-800" style={{backgroundImage: 'url(https://picsum.photos/seed/car-bg/1200/400)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                    Find Your Perfect Ride
                </h1>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    Rent from thousands of cars shared by local hosts. From daily drivers to exotic sports cars.
                </p>
                <button 
                    onClick={onExploreClick}
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
                >
                    Explore Cars
                </button>
            </div>
        </div>
    );
};

export default Hero;