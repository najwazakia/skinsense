export default function DetectionSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden animate-pulse">
            <div className="h-44 bg-stone-100" />
            <div className="p-4 space-y-2.5">
                <div className="h-3.5 bg-stone-100 rounded w-1/3" />
                <div className="h-6 bg-stone-100 rounded w-1/2" />
                <div className="h-1.5 bg-stone-100 rounded-full w-full" />
                <div className="flex justify-between">
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                    <div className="h-3 bg-stone-100 rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}