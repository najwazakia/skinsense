import { Loader2 } from 'lucide-react';

interface Props {
  label?: string;
}

export default function LoadingSpinner({ label }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-green-600">
      <Loader2 className="w-8 h-8 animate-spin" />
      {label && <p className="text-sm font-semibold text-stone-500 animate-pulse">{label}</p>}
    </div>
  );
}