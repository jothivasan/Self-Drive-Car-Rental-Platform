
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Self Drive Car. All rights reserved.</p>
                <p className="text-sm mt-1">Your premier platform for peer-to-peer car rentals.</p>
            </div>
        </footer>
    );
};

export default Footer;