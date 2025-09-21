
import React from 'react';

// NOTE: This icon has been updated to display the Rupee symbol (₹)
// to meet application requirements, while retaining its original component name
// for minimal file changes.
export const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6.75h3.75c1.036 0 1.875-.84 1.875-1.875V11.25c0-1.036-.84-1.875-1.875-1.875H12.75" />
    </svg>
);
