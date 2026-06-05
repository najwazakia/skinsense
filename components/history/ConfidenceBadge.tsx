export default function ConfidenceBadge({ value }: { value: number }) {
    const backgroundColor =
        value >= 80 ? 'bg-green-100 text-green-700'
            : value >= 60 ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${backgroundColor}`}>
            {value.toFixed(1)}%
        </span>
    );
}
