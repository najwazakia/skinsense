export default function PostCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3 animate-pulse">
            <div className="flex gap-1.5">
                <div className="h-5 w-14 bg-stone-100 rounded-full" />
                <div className="h-5 w-20 bg-stone-100 rounded-full" />
            </div>
            <div className="space-y-1.5">
                <div className="h-5 bg-stone-100 rounded w-3/4" />
                <div className="h-5 bg-stone-100 rounded w-1/2" />
            </div>
            <div className="space-y-1">
                <div className="h-3.5 bg-stone-100 rounded w-full" />
                <div className="h-3.5 bg-stone-100 rounded w-4/5" />
            </div>
            <div className="flex items-center gap-4 pt-1">
                <div className="h-3.5 w-12 bg-stone-100 rounded" />
                <div className="h-3.5 w-16 bg-stone-100 rounded" />
                <div className="h-3.5 w-20 bg-stone-100 rounded ml-auto" />
            </div>
        </div>
    );
}