import { Users } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Users className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-bold">Splitz</h1>
    </div>
  );
}
