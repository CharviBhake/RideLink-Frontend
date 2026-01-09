import React from 'react';
import { MapPin, Calendar, Users, Clock, User } from 'lucide-react';

const RideCard = ({ ride }) => {
  const isDriver = ride.type === 'driver';
  const badgeColor = isDriver ? 'bg-white text-black' : 'bg-neutral-800 text-white border border-neutral-700';
  const borderHoverColor = isDriver ? 'hover:border-white' : 'hover:border-neutral-600';
  const primaryBtnColor = isDriver ? 'bg-white hover:bg-neutral-200 text-black' : 'bg-neutral-800 hover:bg-neutral-700 text-white';
  
  return (
    <div className={`bg-neutral-900 p-5 rounded-lg border border-neutral-800 ${borderHoverColor} transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${badgeColor} text-xs font-semibold px-3 py-1 rounded-full`}>
              {isDriver ? "You're Driving" : "You're a Passenger"}
            </span>
          </div>
          <div className="flex items-center text-white font-semibold text-lg mb-2">
            <MapPin className="w-5 h-5 mr-2 text-neutral-400" />
            {ride.from} → {ride.to}
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-400 mb-3">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {ride.date}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {ride.time}
            </span>
            {isDriver && (
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {ride.filledSeats}/{ride.totalSeats} seats filled
              </span>
            )}
          </div>
          {!isDriver && ride.driver && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center mr-3 border border-neutral-700">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{ride.driver.name}</div>
                <div className="text-xs text-neutral-400">⭐ {ride.driver.rating} • {ride.driver.car}</div>
              </div>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ₹{ride.amount}
          </div>
          <div className="text-xs text-neutral-400">
            {isDriver ? 'Total earnings' : 'Your fare'}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className={`flex-1 ${primaryBtnColor} py-2 px-4 rounded-lg text-sm font-semibold transition-all`}>
          {isDriver ? 'View Details' : 'Contact Driver'}
        </button>
        <button className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all border border-neutral-700">
          {isDriver ? 'Cancel Ride' : 'Cancel Booking'}
        </button>
      </div>
    </div>
  );
};

export default RideCard;