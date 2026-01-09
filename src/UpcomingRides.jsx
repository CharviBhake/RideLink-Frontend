import React from 'react';
import RideCard from './RideCard';

const UpcomingRides = () => {
  // Sample upcoming rides data
  const upcomingRides = [
    {
      id: 1,
      type: 'driver',
      from: 'Gurugram',
      to: 'Delhi Airport',
      date: 'Nov 16, 2025',
      time: '7:30 AM',
      filledSeats: 2,
      totalSeats: 3,
      amount: 600
    },
    {
      id: 2,
      type: 'passenger',
      from: 'Delhi',
      to: 'Chandigarh',
      date: 'Nov 18, 2025',
      time: '2:00 PM',
      amount: 350,
      driver: {
        name: 'Priya Sharma',
        rating: '4.9',
        car: 'Toyota Innova'
      }
    },
    {
      id: 3,
      type: 'driver',
      from: 'Noida',
      to: 'Agra',
      date: 'Nov 20, 2025',
      time: '9:00 AM',
      filledSeats: 1,
      totalSeats: 4,
      amount: 250
    }
  ];

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Upcoming Rides</h3>
        <span className="text-sm text-neutral-400">Next 7 days</span>
      </div>

      <div className="space-y-4">
        {upcomingRides.map(ride => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>

      {/* Empty State - Uncomment this and remove the map above when no rides */}
      {/* {upcomingRides.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-neutral-600" />
          </div>
          <h4 className="text-xl font-semibold text-neutral-400 mb-2">No upcoming rides</h4>
          <p className="text-neutral-500 mb-6">Start by adding a ride or searching for one</p>
          <button className="bg-white hover:bg-neutral-200 text-black py-2 px-6 rounded-lg font-semibold transition-all">
            Find Rides
          </button>
        </div>
      )} */}
    </div>
  );
};

export default UpcomingRides;