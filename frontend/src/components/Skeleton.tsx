import React from 'react';
import { motion } from 'framer-motion';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-slate-800 rounded-md ${className}`}></div>
);

export const SkeletonDashboardStats = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
         <div className="space-y-3 w-full">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
         </div>
    </motion.div>
);

export const SkeletonGraph = () => (
    <div className="h-full w-full bg-slate-900 border border-slate-700 rounded-xl p-8 flex items-center justify-center">
         <div className="flex flex-col items-center gap-4 w-full max-w-sm">
             <Skeleton className="h-48 w-48 rounded-full" />
             <Skeleton className="h-6 w-2/3" />
             <Skeleton className="h-4 w-1/2" />
         </div>
    </div>
);

export const SkeletonList = ({ count = 5 }: { count?: number }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
             <div key={i} className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                 <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                 <div className="space-y-2 flex-1">
                     <Skeleton className="h-4 w-1/3" />
                     <Skeleton className="h-3 w-1/2" />
                 </div>
                 <Skeleton className="h-8 w-24 shrink-0" />
             </div>
        ))}
    </div>
);

export default Skeleton;