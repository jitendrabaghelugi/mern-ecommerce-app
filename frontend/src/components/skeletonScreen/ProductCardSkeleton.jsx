import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
    return (
        <div className="w-55 p-4 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <Skeleton className="h-40 w-full rounded-xl mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-24 mt-4" />
            <Skeleton className="h-10 w-full mt-4 rounded-xl" />
        </div>
    );
}

export default ProductCardSkeleton