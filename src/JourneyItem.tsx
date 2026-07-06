import { Star } from "lucide-react";

export interface Journey {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  amountSaved: number;
  driverName: string;
  driverAvatar: string;
  driverRating?: number;
  isRated?: boolean;
}

interface JourneyItemProps {
  journey: Journey;
}

export function JourneyItem({ journey }: JourneyItemProps) {
  return (
    <div className="bg-card rounded-lg p-5 border border-border flex flex-col gap-4">
      {/* Header - Date and Time */}
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase">
          {journey.date}
        </p>
        <p className="text-base font-semibold text-foreground">
          {journey.time}
        </p>
      </div>

      {/* Route - Compact version */}
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
          <span className="text-muted-foreground font-semibold">From</span>
          <span className="text-foreground font-medium truncate">{journey.from}</span>
        </div>
        <div className="flex justify-center">
          <div className="w-0.5 h-3 bg-border"></div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0"></div>
          <span className="text-muted-foreground font-semibold">To</span>
          <span className="text-foreground font-medium truncate">{journey.to}</span>
        </div>
      </div>

      {/* Amount saved */}
      <div className="border-t border-border pt-3">
        <p className="text-xs text-muted-foreground font-semibold mb-1">SAVED</p>
        <p className="text-sm font-bold text-primary mb-3">+${journey.amountSaved.toFixed(2)}</p>
      </div>

      {/* Driver info and action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {journey.driverAvatar}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-semibold">Driver</p>
            <p className="text-xs font-semibold text-foreground truncate">
              {journey.driverName}
            </p>
          </div>
        </div>

        {/* Rating or Rate button */}
        {journey.isRated && journey.driverRating ? (
          <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-semibold text-foreground">
              {journey.driverRating.toFixed(1)}
            </span>
          </div>
        ) : (
          <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-colors ml-2 flex-shrink-0 whitespace-nowrap">
            Rate
          </button>
        )}
      </div>
    </div>
  );
}
