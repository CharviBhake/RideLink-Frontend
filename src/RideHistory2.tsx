import { useState, useEffect } from "react";
import { RideCard } from "./RideHistoryCard";
import { JourneyItem } from "./JourneyItem";
import { MessageCircle } from "lucide-react";

type ViewMode = "driver" | "passenger";

export interface Ride {
  id: string;
  date: string;
  profitEarned: number;
  from: string;
  to: string;
  passengers: number;
  distance: number;
}

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

export interface RideHistoryStats {
  cumulativeSavings: number;
  carbonOffset: number;
  topDestination: string;
  topDestinationCount: number;
}

interface RideHistoryState {
  rides: Ride[];
  journeys: Journey[];
  stats: RideHistoryStats;
  loading: boolean;
  error: string | null;
}

export default function RideHistory() {
  const [viewMode, setViewMode] = useState<ViewMode>("driver");
  const [state, setState] = useState<RideHistoryState>({
    rides: [],
    journeys: [],
    stats: {
      cumulativeSavings: 0,
      carbonOffset: 0,
      topDestination: "",
      topDestinationCount: 0,
    },
    loading: true,
    error: null,
  });

  // Fetch data from your backend APIs
  useEffect(() => {
  const fetchData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const token = localStorage.getItem("token"); // ✅ get token ONCE

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [ridesRes, journeysRes] = await Promise.all([
        fetch("http://localhost:8080/ride/history/driver", { headers }),
        fetch("http://localhost:8080/ride/history/passenger", { headers }),
      ]);

      console.log("Driver status:", ridesRes.status);
      console.log("Passenger status:", journeysRes.status);

      if (!ridesRes.ok || !journeysRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const ridesData = await ridesRes.json();
      const journeysData = await journeysRes.json();
      const rides = Array.isArray(ridesData) ? ridesData : ridesData.rides || [];
      const journeys = Array.isArray(journeysData) ? journeysData : journeysData.journeys || [];

      setState({
        rides,
        journeys,
        stats: journeysData.stats || {
          cumulativeSavings: 0,
          carbonOffset: 0,
          topDestination: "",
          topDestinationCount: 0,
        },
        loading: false,
        error: null,
      });

    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch data",
      }));
    }
  };

  fetchData();
}, []);
  const isDriverMode = viewMode === "driver";

  return (
    <div className="w-full bg-background">
      {/* Header Section */}
      <div className="border-b border-border px-6 py-8 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Ride History</h1>
        <p className="text-muted-foreground mb-6">
          {isDriverMode 
            ? "Review your past kinetic journeys and community impact."
            : "Track your movement and environmental savings."
          }
        </p>

        {/* Toggle Buttons */}
        <div className="flex gap-3 w-full max-w-md">
          <button
            onClick={() => setViewMode("driver")}
            className={`flex-1 px-6 py-2 rounded-lg font-semibold transition-colors ${
              isDriverMode
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border hover:border-primary/50"
            }`}
          >
            As Driver
          </button>
          <button
            onClick={() => setViewMode("passenger")}
            className={`flex-1 px-6 py-2 rounded-lg font-semibold transition-colors ${
              !isDriverMode
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground border border-border hover:border-primary/50"
            }`}
          >
            As Passenger
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-8 lg:px-8">
        {isDriverMode ? (
          // Driver View
          <div>
            {/* Action Button */}
            <div className="mb-8">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l6.894-344.894A23.999 23.999 0 008.5 12H4l8-10l8 10h-4.5a23.991 23.991 0 00-13.6 4.106z" />
                </svg>
                Offer a Ride
              </button>
            </div>

            {/* Rides Grid */}
            {state.loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : state.rides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.rides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No archived rides found
                </h3>
                <p className="text-muted-foreground mb-6">
                  It looks like you haven't completed any rides in this category recently. Ready to hit the road?
                </p>
                <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 mx-auto transition-colors">
                  Browse available rides
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          // Passenger View
          <div>
            {/* Stats Section */}
            {state.loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Cumulative Savings
                    </p>
                    <p className="text-4xl font-bold text-primary">${state.stats.cumulativeSavings.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-2">Total across {state.journeys.length} rides</p>
                  </div>
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Carbon Offset
                    </p>
                    <p className="text-4xl font-bold text-primary">{state.stats.carbonOffset} kg</p>
                    <p className="text-sm text-muted-foreground mt-2">CO2 emissions avoided</p>
                  </div>
                  <div className="bg-card rounded-lg p-6 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Top Destination
                    </p>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-foreground">{state.stats.topDestination}</p>
                        <p className="text-sm text-muted-foreground">{state.stats.topDestinationCount} visits this month</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Journeys */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-6 uppercase tracking-widest text-xs text-muted-foreground">
                    Recent Journeys
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.journeys.map((journey) => (
                      <JourneyItem key={journey.id} journey={journey} />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Switch to Driver Button */}
            <div className="mt-12 flex justify-center lg:justify-start">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Switch to Driver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
