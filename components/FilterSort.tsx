import React from 'react';

interface FilterSortProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
}

const FilterSort: React.FC<FilterSortProps> = ({ searchTerm, setSearchTerm, sortOption, setSortOption }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-grow w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Search by make, model, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary w-full md:w-auto"
                >
                    <option value="">Sort by Price</option>
                    <option value="price-asc">Low to High</option>
                    <option value="price-desc">High to Low</option>
                </select>
            </div>
        </div>
    );
};

export default FilterSort;