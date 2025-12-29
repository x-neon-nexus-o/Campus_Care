import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>

            {/* Card Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card bg-base-100 shadow h-64 border border-gray-100">
                        <div className="card-body">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

                            <div className="mt-auto flex justify-between items-center">
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingSkeleton;
