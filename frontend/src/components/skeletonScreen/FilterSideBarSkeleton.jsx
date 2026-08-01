import React from 'react'
import { Skeleton } from "@/components/ui/skeleton";

const FilterSideBarSkeleton = () => {
    return (
        <div className="w-64 p-5 bg-[#f6f7f9] rounded-lg shadow-sm">
            <div className="mb-6">
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="mb-6">
                <Skeleton className="h-6 w-24 mb-4" />

                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Skeleton className="h-6 w-20 mb-3" />
                <Skeleton className="h-10 w-full" />
            </div>

        </div>
    );
}

export default FilterSideBarSkeleton