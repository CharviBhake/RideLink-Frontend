import { Calendar, MapPin, Users, Navigation } from "lucide-react";

export interface Ride {
  id: string;
  date: string;
  profitEarned: number;
  from: string;
  to: string;
  passengers: number;
  distance: number;
}

interface RideCardProps {
  ride: Ride;
}

export function RideCard({ ride }: RideCardProps) {
  return (
    <div className="bg-card rounded-lg p-5 border border-border hover:border-primary/50 transition-colors flex flex-col gap-4">
      {/* Date and Profit */}
      <div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold mb-1">
          <Calendar className="w-3.5 h-3.5" />
          RIDE DATE
        </div>
        <p className="text-sm text-foreground font-medium mb-3">{ride.date}</p>
        
        <div className="text-xs text-muted-foreground font-semibold mb-1">PROFIT</div>
        <p className="text-lg font-bold text-primary">+2</p>
      </div>

      {/* Route */}
      <div className="border-t border-border pt-3 flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground font-semibold">FROM</p>
              <p className="text-foreground font-medium text-xs truncate">{ride.from}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-0.5 h-3 bg-border"></div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-3 h-3 text-destructive flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground font-semibold">TO</p>
              <p className="text-foreground font-medium text-xs truncate">{ride.to}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Footer */}
      <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{ride.passengers}P</span>
        </div>
        <div className="flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          <span>{ride.distance.toFixed(1)}mi</span>
        </div>
      </div>
    </div>
  );
}
