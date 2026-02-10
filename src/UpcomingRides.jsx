import React from 'react';
import { Car } from 'lucide-react';
import RideCard from './RideCard';

const UpcomingRides = ({ rides, onNavigate ,userData,onChatClick}) => {
 // console.log("userdata",userData);
  return (
    
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Upcoming Rides</h3>
        <span className="text-sm text-neutral-400">Next 7 days</span>
      </div>

      {rides && rides.length > 0 ? (
        <div className="space-y-4">
          {rides.map(ride => (
            <RideCard key={ride.id} ride={ride} userData={userData} onChatClick={onChatClick}/>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-neutral-600" />
          </div>
          <h4 className="text-xl font-semibold text-neutral-400 mb-2">No upcoming rides</h4>
          <p className="text-neutral-500 mb-6">Start by adding a ride or searching for one</p>
          {onNavigate && (
            <button 
              onClick={() => onNavigate('searchRide')}
              className="bg-white hover:bg-neutral-200 text-black py-2 px-6 rounded-lg font-semibold transition-all"
            >
              Find Rides
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UpcomingRides;